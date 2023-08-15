import { Helpers } from '@global/helpers/helpers';
import { IPostDocument } from '@post/interfaces/post.interface';
import { PostModel } from '@post/models/post.schema';
import { IQueryReaction, IReactionDocument, IReactionJob } from '@reaction/interfaces/reaction.interface';
import { ReactionModel } from '@reaction/models/reaction.schema';
import { UserCache } from '@service/redis/user.cache';
import { IUserDocument } from '@user/interfaces/user.interface';
import { omit } from 'lodash';
import mongoose from 'mongoose';

const userCache: UserCache = new UserCache();

class ReactionService {
  public async addReactionDataToDB(reaction: IReactionJob): Promise<void> {
    const { postId, userTo, userFrom, username, type, previousReaction, reactionObject } = reaction;

    let updateReactionObject: IReactionDocument = reactionObject as IReactionDocument;

    if (previousReaction) {
      updateReactionObject = omit(reactionObject, ['_id']);
    }

    const updatedReaction: [IUserDocument, IReactionDocument, IPostDocument] = (await Promise.all([
      userCache.getUserFromCache(`${userTo}`),
      ReactionModel.replaceOne(
        {
          postId,
          type: previousReaction,
          username
        },
        updateReactionObject,
        {
          upsert: true
        }
      ),
      PostModel.findOneAndUpdate(
        {
          _id: postId
        },
        {
          $inc: {
            [`reactions.${previousReaction}`]: -1,
            [`reactions.${type}`]: 1
          }
        },
        {
          new: true
        }
      )
    ])) as unknown as [IUserDocument, IReactionDocument, IPostDocument];

    // send reactions notification to user
  }

  public async removeReactionDateFromDB(reactionData: IReactionJob): Promise<void> {
    const { postId, previousReaction, username } = reactionData;

    await Promise.all([
      ReactionModel.deleteOne({
        postId,
        type: previousReaction,
        username
      }),
      PostModel.updateOne(
        {
          _id: postId
        },
        {
          $inc: {
            [`reactions.${previousReaction}`]: -1
          }
        }
      )
    ]);
  }

  public async getPostReactions(query: IQueryReaction, sort: Record<string, 1 | -1>): Promise<[IReactionDocument[], number]> {
    const reactions: IReactionDocument[] = await ReactionModel.aggregate([
      {
        $match: {
          query
        }
      },
      {
        $sort: sort
      }
    ]);

    return [reactions, reactions.length];
  }

  public async getSinglePostReactionByUsername(postId: string, username: string): Promise<[IReactionDocument, number] | []> {
    const reactions: IReactionDocument[] = await ReactionModel.aggregate([
      {
        $match: {
          postId: new mongoose.Types.ObjectId(postId),
          username: Helpers.firstLetterUppercase(username)
        }
      }
    ]);
    return reactions.length ? [reactions[0], reactions.length] : [];
  }

  public async getReactionsByUsername(username: string): Promise<IReactionDocument[]> {
    const reactions: IReactionDocument[] = await ReactionModel.aggregate([
      {
        $match: {
          username: Helpers.firstLetterUppercase(username)
        }
      }
    ]);
    return reactions;
  }
}

export const reactionService: ReactionService = new ReactionService();
