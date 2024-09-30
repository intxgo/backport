import { ValidConfigOptions } from '../../options/options';
import { mergePullRequest } from '../github/v3/mergePullRequest';
import { logger } from '../logger';
import { ora } from '../ora';

export async function autoMergeNowOrLater(
  options: ValidConfigOptions,
  pullNumber: number,
) {
  const text = `Auto-merge: Enabling via "${options.autoMergeMethod}"`;
  logger.info(text);

  const spinner = ora(options.interactive, text).start();

  if (options.dryRun) {
    spinner.succeed();
    return;
  }

  try {
    logger.info('Auto merge: Attempting to merge immediately');
    await mergePullRequest(options, pullNumber);
    spinner.text = 'Auto-merge: Pull request was merged immediately';
  } catch (e) {
    logger.warn(`Auto merge: An error occurred ${e}`);
    spinner.fail();
  }
}
