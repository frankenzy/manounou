# 📁 Manounous - Project Structure

*Generated on: 17/02/2026 18:29:52*

## 📋 Quick Overview

| Metric | Value |
|--------|-------|
| 📄 Total Files | 170 |
| 📁 Total Folders | 77 |
| 🌳 Max Depth | 7 levels |
| 🛠️ Tech Stack | React, Next.js, TypeScript, CSS, Sass/SCSS, Node.js |

## ⭐ Important Files

- 🟡 🚫 **.gitignore** - Git ignore rules
- 🔴 📖 **README.md** - Project documentation
- 🟡 🐳 **docker-compose.yml** - Docker compose
- 🔵 🔍 **eslint.config.mjs** - ESLint config
- 🟡 ▲ **next.config.ts** - Next.js config
- 🟡 🔒 **package-lock.json** - Dependency lock
- 🔴 📦 **package.json** - Package configuration
- 🟡 🔷 **tsconfig.json** - TypeScript config

## 📊 File Statistics

### By File Type

- 🔷 **.ts** (TypeScript files): 54 files (31.8%)
- ⚛️ **.tsx** (React TypeScript files): 45 files (26.5%)
- 📄 **.meta** (Other files): 13 files (7.6%)
- 🎨 **.svg** (SVG images): 11 files (6.5%)
- 📜 **.js** (JavaScript files): 9 files (5.3%)
- ⚙️ **.json** (JSON files): 6 files (3.5%)
- 🎨 **.css** (Stylesheets): 6 files (3.5%)
- 📖 **.md** (Markdown files): 3 files (1.8%)
- 🖼️ **.png** (PNG images): 3 files (1.8%)
- 🖼️ **.jpg** (JPEG images): 3 files (1.8%)
- 📄 **.mjs** (Other files): 2 files (1.2%)
- ⚙️ **.yaml** (YAML files): 2 files (1.2%)
- 🖼️ **.ico** (Icon files): 2 files (1.2%)
- 📄 **.prod** (Other files): 1 files (0.6%)
- 🚫 **.gitignore** (Git ignore): 1 files (0.6%)
- 📄 **.** (Other files): 1 files (0.6%)
- 📄 **.db** (Other files): 1 files (0.6%)
- 📄 **.conf** (Other files): 1 files (0.6%)
- ⚙️ **.yml** (YAML files): 1 files (0.6%)
- 📄 **.patch** (Other files): 1 files (0.6%)
- 🖼️ **.jpeg** (JPEG images): 1 files (0.6%)
- 🖼️ **.webp** (WebP images): 1 files (0.6%)
- 🎨 **.scss** (Sass stylesheets): 1 files (0.6%)
- 📄 **.sqlite** (Other files): 1 files (0.6%)

### By Category

- **TypeScript**: 54 files (31.8%)
- **React**: 45 files (26.5%)
- **Other**: 21 files (12.4%)
- **Assets**: 21 files (12.4%)
- **Config**: 9 files (5.3%)
- **JavaScript**: 9 files (5.3%)
- **Styles**: 7 files (4.1%)
- **Docs**: 3 files (1.8%)
- **DevOps**: 1 files (0.6%)

### 📁 Largest Directories

- **root**: 170 files
- **src**: 112 files
- **src/components**: 35 files
- **public**: 20 files
- **src/app**: 19 files

## 🌳 Directory Structure

```
Manounous/
├── 📄 .env.prod
├── 🟡 🚫 **.gitignore**
├── 📄 .npmrc
├── 📂 .qodo/
├── 📂 data/
│   └── 📄 manounous.db
├── 📄 dbconfig.conf
├── ⚙️ demo-wording.json
├── 📖 Doc.md
├── 🟡 🐳 **docker-compose.yml**
├── 🔵 🔍 **eslint.config.mjs**
├── 📄 fix-tabs.patch
├── 📂 minio-data/
│   ├── 📂 .minio.sys/
│   │   ├── 📂 buckets/
│   │   │   ├── 📂 .bloomcycle.bin/
│   │   │   │   └── 📄 xl.meta
│   │   │   ├── 📂 .usage-cache.bin/
│   │   │   │   └── 📄 xl.meta
│   │   │   ├── 📂 .usage-cache.bin.bkp/
│   │   │   │   └── 📄 xl.meta
│   │   │   ├── 📂 .usage.json/
│   │   │   │   └── 📄 xl.meta
│   │   │   └── 📂 uploads/
│   │   │   │   ├── 📂 .metadata.bin/
│   │   │   │   │   └── 📄 xl.meta
│   │   │   │   ├── 📂 .usage-cache.bin/
│   │   │   │   │   └── 📄 xl.meta
│   │   │   │   └── 📂 .usage-cache.bin.bkp/
│   │   │   │   │   └── 📄 xl.meta
│   │   ├── ⚙️ config/
│   │   │   ├── 📂 config.json/
│   │   │   │   └── 📄 xl.meta
│   │   │   └── 📂 iam/
│   │   │   │   ├── 📂 format.json/
│   │   │   │   │   └── 📄 xl.meta
│   │   │   │   └── 📂 sts/
│   │   │   │   │   └── 📂 GBYW5X9ZVI2MGS9WY6ZI/
│   │   │   │   │   │   └── 📂 identity.json/
│   │   │   │   │   │   │   └── 📄 xl.meta
│   │   ├── ⚙️ format.json
│   │   ├── 📂 multipart/
│   │   └── 📂 pool.bin/
│   │   │   └── 📄 xl.meta
│   └── 📂 uploads/
│   │   ├── 📂 1771349931414-487536830_1197531382382221_4024605654121015043_n.jpg/
│   │   │   └── 📄 xl.meta
│   │   └── 📂 1771351632118-487536830_1197531382382221_4024605654121015043_n.jpg/
│   │   │   └── 📄 xl.meta
├── 🔷 next-env.d.ts
├── 🟡 ▲ **next.config.ts**
├── 🟡 🔒 **package-lock.json**
├── 🔴 📦 **package.json**
├── ⚙️ pnpm-lock.yaml
├── ⚙️ pnpm-workspace.yaml
├── 📄 postcss.config.mjs
├── ⚙️ profil-wording.json
├── 🌐 public/
│   ├── 🖼️ 001.png
│   ├── 🖼️ 02.png
│   ├── 🖼️ 03.png
│   ├── 🖼️ 04.jpg
│   ├── 🖼️ 05.jpeg
│   ├── 🖼️ 06.jpg
│   ├── 📦 assets/
│   ├── 🎨 bitbucket.svg
│   ├── 🎨 cadenar.svg
│   ├── 🖼️ favicon.ico
│   ├── 🎨 file.svg
│   ├── 🎨 github.svg
│   ├── 🎨 gitlab.svg
│   ├── 🎨 globe.svg
│   ├── 🖼️ hero.webp
│   ├── 🎨 keys.svg
│   ├── 🎨 logo.svg
│   ├── 🎨 next.svg
│   ├── 🖼️ sd.jpg
│   ├── 🎨 vercel.svg
│   └── 🎨 window.svg
├── 🔴 📖 **README.md**
├── 📂 script/
│   ├── 🔷 init-db.ts
│   └── 🔷 seed-db.ts
├── 📁 src/
│   ├── 🚀 app/
│   │   ├── 📂 about/
│   │   │   ├── ⚛️ _page.tsx
│   │   │   ├── ⚛️ page.tsx
│   │   │   └── 🎨 style.css
│   │   ├── 📂 announcement/
│   │   │   ├── 📂 [id]/
│   │   │   │   └── ⚛️ page.tsx
│   │   │   └── ⚛️ announcement.tsx
│   │   ├── 📂 contact/
│   │   │   ├── ⚛️ page.tsx
│   │   │   └── 🎨 style.css
│   │   ├── 🖼️ favicon.ico
│   │   ├── 🎨 globals.css
│   │   ├── 📂 home/
│   │   ├── ⚛️ layout.tsx
│   │   ├── 📂 login/
│   │   │   ├── ⚛️ page.tsx
│   │   │   └── 🎨 style.scss
│   │   ├── 📂 manounou/
│   │   │   └── ⚛️ page.tsx
│   │   ├── ⚛️ page.tsx
│   │   ├── 📂 register/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 service/
│   │   │   ├── 📜 projets.js
│   │   │   ├── 🔷 query.ts
│   │   │   └── 📜 utilisateurs.js
│   │   └── 📂 user/
│   │   │   └── ⚛️ page.tsx
│   ├── 📂 Auth/
│   │   └── 🔷 login.ts
│   ├── 🧩 components/
│   │   ├── 📂 Announcement/
│   │   │   ├── ⚛️ AnnouncementCreateForm.tsx
│   │   │   ├── ⚛️ AnnouncementEditForm.tsx
│   │   │   ├── ⚛️ AnnouncementModal.tsx
│   │   │   ├── ⚛️ AnnounceSkeleton.tsx
│   │   │   ├── 🔷 index.ts
│   │   │   ├── 🔷 types.ts
│   │   │   ├── 🔷 useAnnouncementForm.ts
│   │   │   └── 🔷 useAnnouncementSubmit.ts
│   │   ├── ⚛️ Badge.tsx
│   │   ├── ⚛️ buttons.tsx
│   │   ├── ⚛️ card.tsx
│   │   ├── 📂 comments/
│   │   │   ├── ⚛️ AnnounceSkeleton.tsx
│   │   │   ├── ⚛️ comment copy.tsx
│   │   │   ├── ⚛️ comment.tsx
│   │   │   └── ⚛️ CommentTime.tsx
│   │   ├── ⚛️ CreateAnnouncement.tsx
│   │   ├── ⚛️ DisplayTime.tsx
│   │   ├── ⚛️ DragDrop.tsx
│   │   ├── ⚛️ Dropdown.tsx
│   │   ├── ⚛️ footer.tsx
│   │   ├── ⚛️ header.tsx
│   │   ├── ⚛️ HorizontalBar.tsx
│   │   ├── ⚛️ Icon.tsx
│   │   ├── ⚛️ Input.tsx
│   │   ├── ⚛️ List.tsx
│   │   ├── ⚛️ localization.tsx
│   │   ├── ⚛️ Logo.tsx
│   │   ├── ⚛️ Menu.tsx
│   │   ├── ⚛️ Modal.tsx
│   │   ├── ⚛️ RegisterLink.tsx
│   │   ├── ⚛️ RelativeTime.tsx
│   │   ├── ⚛️ Section.tsx
│   │   ├── ⚛️ Select.tsx
│   │   ├── ⚛️ uploadImage.tsx
│   │   └── ⚛️ VerticalBar.tsx
│   ├── 📂 context/
│   │   └── ⚛️ ThemeContext.tsx
│   ├── 📂 controllers/
│   │   ├── 🔷 Announcement.controller.ts
│   │   ├── 🔷 BaseController.ts
│   │   ├── 🔷 Comment.controller.ts
│   │   ├── 📂 comments/
│   │   │   └── 🔷 comment.controller.ts
│   │   └── 🔷 UserController.ts
│   ├── 📂 core/
│   │   ├── 📂 domain/
│   │   │   └── 📂 value-objects/
│   │   └── 📂 infrastructure/
│   │   │   ├── 📂 persistence/
│   │   │   └── 📂 validation/
│   ├── 📂 database/
│   │   └── 📄 database.sqlite
│   ├── 🎣 hooks/
│   │   ├── 🔷 useComments.ts
│   │   ├── 🔷 useIntersection.ts
│   │   ├── 🔷 useRelativeTime.ts
│   │   ├── ⚛️ useUsers.tsx
│   │   └── 🔷 validateNumber.ts
│   ├── 📚 lib/
│   │   ├── 📜 article.js
│   │   ├── 🔷 db.ts
│   │   └── 🔷 minio.ts
│   ├── 🔷 middleware.ts
│   ├── 📂 models/
│   │   ├── 🔷 Annnouncements.ts
│   │   ├── 🔷 Comment.ts
│   │   └── 🔷 User.model.ts
│   ├── 📄 pages/
│   │   └── 🔌 api/
│   │   │   ├── 📂 announcements/
│   │   │   │   ├── 🔷 [id].ts
│   │   │   │   └── 🔷 index.ts
│   │   │   ├── 📂 Auth/
│   │   │   │   └── 🔷 Login.ts
│   │   │   ├── 📂 comments/
│   │   │   │   ├── 🔷 [id].ts
│   │   │   │   └── 🔷 index.ts
│   │   │   ├── 📂 upload/
│   │   │   │   ├── 🔷 delete.ts
│   │   │   │   ├── 🔷 index.ts
│   │   │   │   └── 🔷 route.ts
│   │   │   ├── 📂 users/
│   │   │   │   ├── 🔷 [id].ts
│   │   │   │   └── 🔷 index.ts
│   │   │   ├── 📂 utilisateurs/
│   │   │   │   ├── 📜 [id].js
│   │   │   │   ├── 📜 create.js
│   │   │   │   ├── 📜 delete.js
│   │   │   │   ├── 📜 update.js
│   │   │   │   └── 📜 users.js
│   │   │   └── 📜 utilisateurs.js
│   ├── 📂 presentation/
│   │   └── 🧩 components/
│   │   │   ├── 📂 features/
│   │   │   └── 🎨 ui/
│   ├── 📂 repositories/
│   │   ├── 🔷 AnnouncementRepository.ts
│   │   ├── 🔷 CommentRepository.ts
│   │   ├── 🔷 IAnnouncementRepository.ts
│   │   ├── 🔷 ICommentRepository.ts
│   │   ├── 🔷 IUserRepository.ts
│   │   └── 🔷 UserRepository.ts
│   ├── 📂 services/
│   │   ├── 🔷 AnnouncementService.ts
│   │   ├── 🔌 api/
│   │   ├── 📂 comments/
│   │   │   ├── 🔷 comment.service.ts
│   │   │   └── 🔷 Icomment.ts
│   │   ├── 🔷 IAnnouncementService.ts
│   │   ├── 🔷 IUserService.ts
│   │   └── 🔷 UserService.ts
│   ├── 🎨 styles/
│   │   ├── 🎨 animations.css
│   │   ├── 🎨 globals.css
│   │   └── 🎨 layout.module.css
│   ├── 📂 types/
│   │   ├── 🔷 index.ts
│   │   └── 🔷 portfolio.ts
│   ├── 🔧 utils/
│   │   ├── ⚛️ animationUtils.tsx
│   │   ├── 🔷 fetchData.ts
│   │   └── 🔷 getCreatedAt.ts
│   └── 📂 validators/
│   │   ├── 🔷 Announcement.validation.ts
│   │   └── 🔷 UserValidator.ts
├── 🔷 tailwind.config.ts
├── 📖 TODO.md
└── 🟡 🔷 **tsconfig.json**
```

## 📖 Legend

### File Types
- 📄 Other: Other files
- 🚫 DevOps: Git ignore
- 📖 Docs: Markdown files
- ⚙️ Config: JSON files
- ⚙️ Config: YAML files
- 🔷 TypeScript: TypeScript files
- ⚙️ Config: YAML files
- 🖼️ Assets: PNG images
- 🖼️ Assets: JPEG images
- 🖼️ Assets: JPEG images
- 🎨 Assets: SVG images
- 🖼️ Assets: Icon files
- 🖼️ Assets: WebP images
- ⚛️ React: React TypeScript files
- 🎨 Styles: Stylesheets
- 🎨 Styles: Sass stylesheets
- 📜 JavaScript: JavaScript files

### Importance Levels
- 🔴 Critical: Essential project files
- 🟡 High: Important configuration files
- 🔵 Medium: Helpful but not essential files
