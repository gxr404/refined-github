import {$optional} from 'select-dom/strict.js';
import * as pageDetect from 'github-url-detection';

import features from '../feature-manager.js';

async function sessionResumeHandler(): Promise<void> {
	await Promise.resolve(); // The `session:resume` event fires a bit too early
	const cancelMergeButton = $optional('.merge-branch-form .js-details-target');
	if (cancelMergeButton) {
		cancelMergeButton.click();
		document.removeEventListener('session:resume', sessionResumeHandler);
	}
}

function init(signal: AbortSignal): void {
	document.addEventListener('session:resume', sessionResumeHandler, {signal});
}

void features.add(import.meta.url, {
	include: [
		pageDetect.isPRConversation,
	],
	init,
});

/*

Test URLs:

1. Visit https://github.com/pulls
2. Open any PR you can merge
2. Click "Merge pull request"
3. Click "Cancel merge"
4. Reload the page
5. The panel should not still be open

*/
