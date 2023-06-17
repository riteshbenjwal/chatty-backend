import { config } from '@root/config';
import { reactionService } from '@service/db/reaction.service';
import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';

const log: Logger = config.createLogger('reactionWorker');

class ReactionWorker {
  async addReactionToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { data } = job;

      console.log('i am here ');
      await reactionService.addReactionDataToDB(data);

      job.progress(100);
      done(null, data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }

  async removeReactionFromDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { data } = job;

      await reactionService.removeReactionDateFromDB(data);

      job.progress(100);
      done(null, data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
}

export const reactionWorker: ReactionWorker = new ReactionWorker();
