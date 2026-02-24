# 📁 Manounous - Project Structure

*Generated on: 22/02/2026 01:48:48*

## 📋 Quick Overview

| Metric | Value |
|--------|-------|
| 📄 Total Files | 135 |
| 📁 Total Folders | 65 |
| 🌳 Max Depth | 5 levels |
| 🛠️ Tech Stack | React, Next.js, TypeScript, CSS, Sass/SCSS, Node.js |

## ⭐ Important Files

- 🟡 🚫 **.gitignore** - Git ignore rules
- 🟡 🐳 **docker-compose.yml** - Docker compose
- 🔵 🔍 **eslint.config.mjs** - ESLint config
- 🟡 ▲ **next.config.ts** - Next.js config
- 🟡 🔒 **package-lock.json** - Dependency lock
- 🔴 📦 **package.json** - Package configuration
- 🟡 🔷 **tsconfig.json** - TypeScript config

## 📊 File Statistics

### By File Type

- 🔷 **.ts** (TypeScript files): 47 files (34.8%)
- ⚛️ **.tsx** (React TypeScript files): 26 files (19.3%)
- 📄 **.meta** (Other files): 12 files (8.9%)
- 🎨 **.svg** (SVG images): 11 files (8.1%)
- 🎨 **.css** (Stylesheets): 6 files (4.4%)
- ⚙️ **.json** (JSON files): 5 files (3.7%)
- 🖼️ **.png** (PNG images): 3 files (2.2%)
- 🖼️ **.jpg** (JPEG images): 3 files (2.2%)
- 📖 **.md** (Markdown files): 2 files (1.5%)
- 📄 **.mjs** (Other files): 2 files (1.5%)
- ⚙️ **.yaml** (YAML files): 2 files (1.5%)
- 🖼️ **.ico** (Icon files): 2 files (1.5%)
- 📄 **.example** (Other files): 1 files (0.7%)
- 📄 **.prod** (Other files): 1 files (0.7%)
- 🚫 **.gitignore** (Git ignore): 1 files (0.7%)
- 📄 **.** (Other files): 1 files (0.7%)
- 📄 **.db** (Other files): 1 files (0.7%)
- ⚙️ **.yml** (YAML files): 1 files (0.7%)
- 📄 **.bin** (Other files): 1 files (0.7%)
- 📄 **.1** (Other files): 1 files (0.7%)
- 📄 **.prisma** (Other files): 1 files (0.7%)
- 🖼️ **.jpeg** (JPEG images): 1 files (0.7%)
- 🖼️ **.webp** (WebP images): 1 files (0.7%)
- 📄 **.sh** (Other files): 1 files (0.7%)
- 🎨 **.scss** (Sass stylesheets): 1 files (0.7%)
- 📄 **.tsbuildinfo** (Other files): 1 files (0.7%)

### By Category

- **TypeScript**: 47 files (34.8%)
- **React**: 26 files (19.3%)
- **Other**: 23 files (17.0%)
- **Assets**: 21 files (15.6%)
- **Config**: 8 files (5.9%)
- **Styles**: 7 files (5.2%)
- **Docs**: 2 files (1.5%)
- **DevOps**: 1 files (0.7%)

### 📁 Largest Directories

- **root**: 135 files
- **src**: 76 files
- **public**: 20 files
- **src/components**: 20 files
- **minio-data**: 15 files

## 🌳 Directory Structure

```
Manounous/
├── 📄 .env.example
├── 📄 .env.prod
├── 🟡 🚫 **.gitignore**
├── 📄 .npmrc
├── 📂 .qodo/
├── 📂 data/
│   └── 📄 manounous.db
├── 🟡 🐳 **docker-compose.yml**
├── 🔵 🔍 **eslint.config.mjs**
├── 📖 FEATURE_METHODOLOGY.md
├── 📂 minio-data/
│   ├── 📂 .minio.sys/
│   │   ├── 📂 buckets/
│   │   │   ├── 📂 .bloomcycle.bin/
│   │   │   │   └── 📄 xl.meta
│   │   │   ├── 📂 .heal/
│   │   │   │   └── 📂 mrf/
│   │   │   │   │   └── 📄 list.bin
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
│   │   │   │   └── 📂 format.json/
│   │   │   │   │   └── 📄 xl.meta
│   │   ├── ⚙️ format.json
│   │   ├── 📂 multipart/
│   │   └── 📂 pool.bin/
│   │   │   └── 📄 xl.meta
│   └── 📂 uploads/
│   │   ├── 📂 1771349931414-487536830_1197531382382221_4024605654121015043_n.jpg/
│   │   │   └── 📄 xl.meta
│   │   └── 📂 1771516986039-lundi.png/
│   │   │   ├── 📂 a591cd6f-85a1-4cee-a6e4-0342ac67feca/
│   │   │   │   └── 📄 part.1
│   │   │   └── 📄 xl.meta
├── 🔷 next-env.d.ts
├── 🟡 ▲ **next.config.ts**
├── 🟡 🔒 **package-lock.json**
├── 🔴 📦 **package.json**
├── ⚙️ pnpm-lock.yaml
├── ⚙️ pnpm-workspace.yaml
├── 📄 postcss.config.mjs
├── 📂 prisma/
│   └── 📄 schema.prisma
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
├── 📂 script/
│   ├── 🔷 init-db.ts
│   └── 🔷 seed-db.ts
├── 📂 scripts/
│   └── 📄 detect-dead-code.sh
├── 📁 src/
│   ├── 🚀 app/
│   │   ├── 📂 about/
│   │   │   ├── ⚛️ page.tsx
│   │   │   └── 🎨 style.css
│   │   ├── 📂 announcement/
│   │   │   └── 📂 [id]/
│   │   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 contact/
│   │   │   ├── ⚛️ page.tsx
│   │   │   └── 🎨 style.css
│   │   ├── 🖼️ favicon.ico
│   │   ├── 🎨 globals.css
│   │   ├── ⚛️ layout.tsx
│   │   ├── 📂 login/
│   │   │   ├── ⚛️ page.tsx
│   │   │   └── 🎨 style.scss
│   │   ├── 📂 manounou/
│   │   │   └── ⚛️ page.tsx
│   │   ├── ⚛️ page.tsx
│   │   ├── 📂 register/
│   │   │   └── ⚛️ page.tsx
│   │   └── 📂 user/
│   │   │   └── ⚛️ page.tsx
│   ├── 🧩 components/
│   │   ├── 📂 Announcement/
│   │   │   ├── ⚛️ AnnouncementCreateForm.tsx
│   │   │   ├── ⚛️ AnnouncementModal.tsx
│   │   │   ├── ⚛️ AnnounceSkeleton.tsx
│   │   │   ├── 🔷 index.ts
│   │   │   ├── 🔷 types.ts
│   │   │   ├── 🔷 useAnnouncementForm.ts
│   │   │   └── 🔷 useAnnouncementSubmit.ts
│   │   ├── ⚛️ buttons.tsx
│   │   ├── 📂 comments/
│   │   │   ├── ⚛️ comment.tsx
│   │   │   └── ⚛️ CommentTime.tsx
│   │   ├── ⚛️ header.tsx
│   │   ├── ⚛️ Input.tsx
│   │   ├── ⚛️ Logo.tsx
│   │   ├── ⚛️ Menu.tsx
│   │   ├── ⚛️ Modal.tsx
│   │   ├── 📂 modals/
│   │   │   └── ⚛️ deleteModal.tsx
│   │   ├── ⚛️ RegisterLink.tsx
│   │   ├── ⚛️ RelativeTime.tsx
│   │   ├── 📂 repost/
│   │   │   └── ⚛️ repost.tsx
│   │   └── ⚛️ uploadImage.tsx
│   ├── 📂 controllers/
│   │   ├── 🔷 Announcement.controller.ts
│   │   ├── 🔷 BaseController.ts
│   │   ├── 📂 comments/
│   │   │   └── 🔷 comment.controller.ts
│   │   ├── 🔷 Repost.controller.ts
│   │   └── 🔷 UserController.ts
│   ├── 🎣 hooks/
│   │   ├── 🔷 useComments.ts
│   │   ├── 🔷 useIntersection.ts
│   │   └── 🔷 useRelativeTime.ts
│   ├── 📚 lib/
│   │   ├── 🔷 cloudinary.ts
│   │   ├── 🔷 db.ts
│   │   └── 🔷 minio.ts
│   ├── 🔷 middleware.ts
│   ├── 📂 models/
│   │   ├── 🔷 Announcement.ts
│   │   ├── 🔷 Comment.ts
│   │   ├── 🔷 Repost.ts
│   │   └── 🔷 User.model.ts
│   ├── 📄 pages/
│   │   └── 🔌 api/
│   │   │   ├── 📂 announcements/
│   │   │   │   ├── 🔷 [id].ts
│   │   │   │   └── 🔷 index.ts
│   │   │   ├── 📂 comments/
│   │   │   │   ├── 🔷 [id].ts
│   │   │   │   └── 🔷 index.ts
│   │   │   ├── 📂 repost/
│   │   │   │   └── 🔷 index.ts
│   │   │   ├── 📂 upload/
│   │   │   │   ├── 🔷 delete.ts
│   │   │   │   ├── 🔷 index copy.ts
│   │   │   │   ├── 🔷 index.minio.ts
│   │   │   │   └── 🔷 index.ts
│   │   │   └── 📂 users/
│   │   │   │   ├── 🔷 [id].ts
│   │   │   │   └── 🔷 index.ts
│   ├── 📂 repositories/
│   │   ├── 🔷 AnnouncementRepository.ts
│   │   ├── 🔷 CommentRepository.ts
│   │   ├── 🔷 RepostRepository.ts
│   │   └── 🔷 UserRepository.ts
│   ├── 📂 services/
│   │   ├── 🔷 AnnouncementService.ts
│   │   ├── 📂 comments/
│   │   │   └── 🔷 comment.service.ts
│   │   ├── 📂 repost/
│   │   │   └── 🔷 repost.service.ts
│   │   └── 🔷 UserService.ts
│   ├── 🎨 styles/
│   │   ├── 🎨 animations.css
│   │   ├── 🎨 globals.css
│   │   └── 🎨 layout.module.css
│   ├── 📂 types/
│   │   └── 🔷 index.ts
│   ├── 🔧 utils/
│   │   ├── ⚛️ animationUtils.tsx
│   │   └── 🔷 getCreatedAt.ts
│   └── 📂 validators/
│   │   └── 🔷 UserValidator.ts
├── 🔷 tailwind.config.ts
├── 📖 TODO.md
├── 🟡 🔷 **tsconfig.json**
└── 📄 tsconfig.tsbuildinfo
```

## 📖 Legend

### File Types
- 📄 Other: Other files
- 🚫 DevOps: Git ignore
- 📖 Docs: Markdown files
- ⚙️ Config: YAML files
- ⚙️ Config: JSON files
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

### Importance Levels
- 🔴 Critical: Essential project files
- 🟡 High: Important configuration files
- 🔵 Medium: Helpful but not essential files
