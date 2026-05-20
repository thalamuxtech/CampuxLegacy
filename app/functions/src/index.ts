import { initializeApp } from 'firebase-admin/app';

initializeApp();

export { onUserCreate } from './triggers/onUserCreate';
export { onPortraitUpload } from './triggers/onPortraitUpload';
export { onGoodwillCreate } from './triggers/onGoodwillCreate';
export { onApprovalChange } from './triggers/onApprovalChange';
export { sealClass } from './http/sealClass';
export { submitGoodwill } from './http/submitGoodwill';
export { setRole } from './http/setRole';
export { dailyDigest } from './jobs/dailyDigest';
