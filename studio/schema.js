import { localizedString, localizedText, localizedBlock } from './schemas/localized.js';
import homepage from './schemas/homepage.js';
import about from './schemas/about.js';
import researchArea from './schemas/researchArea.js';
import publication from './schemas/publication.js';
import blog from './schemas/blog.js';
import event from './schemas/event.js';
import consulting from './schemas/consulting.js';
import press from './schemas/press.js';
import settings from './schemas/settings.js';

export const schemaTypes = [
  localizedString,
  localizedText,
  localizedBlock,
  homepage,
  about,
  researchArea,
  publication,
  blog,
  event,
  consulting,
  press,
  settings
];
