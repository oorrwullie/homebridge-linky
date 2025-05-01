import fs from 'node:fs';

const fallbackNotes = `\
## v${process.env.VERSION || 'x.y.z'} - Minor Improvements 🚀

This release includes minor improvements, fixes, and internal enhancements.

### 🛠️ Changes

- Various bug fixes and stability improvements.
- Code cleanup and refactoring.

Thanks for using Linky! 🎉
`;

fs.writeFileSync('RELEASE_NOTES.md', fallbackNotes, 'utf-8');
console.log('✅ Static fallback release notes written.');
