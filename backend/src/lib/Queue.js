import Bee from 'bee-queue';

import redisConfig from '../config/redis';
import RecoverMail from '../app/jobs/RecoverMail';
import RecoverSuccessMail from '../app/jobs/RecoverSuccessMail';
import HackathonCreationMail from '../app/jobs/HackathonCreationMail';
import HackathonUpdateMail from '../app/jobs/HackathonUpdateMail';
import HackathonDeleteMail from '../app/jobs/HackathonDeleteMail';
import ParticipantSubscribeMail from '../app/jobs/ParticipantSubscribeMail';
import ParticipantUnsubscribeMail from '../app/jobs/ParticipantUnsubscribeMail';
import ConfirmMail from '../app/jobs/ConfirmMail';

const jobs = [
  RecoverMail,
  RecoverSuccessMail,
  HackathonCreationMail,
  HackathonUpdateMail,
  HackathonDeleteMail,
  ParticipantSubscribeMail,
  ParticipantUnsubscribeMail,
  ConfirmMail,
];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    // eslint-disable-next-line no-console
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
