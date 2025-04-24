# Next.js Portfolio with Firebase

A modern, dynamic portfolio website built with Next.js, Firebase, and shadcn/ui. This boilerplate provides a complete solution for creating and managing a professional portfolio website with an admin panel for content management.

## Features

- 🎨 Modern UI with shadcn/ui components
- 🌙 Dark/Light mode support
- 🔐 Firebase Authentication
- 📝 Dynamic content management
- 🖼️ Project showcase
- 🛠️ Skills display
- 📱 Fully responsive design
- ⚡ Fast and SEO-friendly
- 🔄 Real-time updates
- 🎭 Smooth animations with Framer Motion

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Firebase (Authentication, Firestore)
- **Animations**: Framer Motion
- **Deployment**: Vercel (recommended)

## Prerequisites

- Node.js 18+ and npm/yarn
- Firebase account
- Basic knowledge of React and TypeScript

## Getting Started

### 1. Clone the Repository

```bash
git clone git@github.com:Uditya69/Portfolio-BoilerPlate.git
cd your-portfolio
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Get your Firebase configuration

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see your portfolio.

## Project Structure

```
├── app/
│   ├── admin/           # Admin panel pages
│   ├── about/           # About page
│   ├── projects/        # Projects page
│   ├── contact/         # Contact page
│   └── page.tsx         # Home page
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── admin/          # Admin panel components
│   └── ...             # Other components
├── lib/
│   ├── firebase.ts     # Firebase configuration
│   └── utils.ts        # Utility functions
├── contexts/
│   └── auth-context.ts # Authentication context
└── public/             # Static assets
```

## Admin Panel Usage

### 1. Access the Admin Panel

Visit `/admin` and log in with your Firebase credentials.

### 2. Manage Content

The admin panel allows you to manage:

- **Profile Information**
  - Name, title, bio
  - Profile image
  - Social links
  - Location

- **Projects**
  - Add/Edit/Delete projects
  - Upload project images
  - Add project links
  - Specify technologies used

- **Skills**
  - Add/Edit/Delete skills
  - Set skill levels
  - Categorize skills

- **SEO Settings**
  - Site title
  - Meta description
  - Keywords
  - Open Graph images

## Customization

### 1. Styling

- Modify `tailwind.config.js` for theme customization
- Edit `globals.css` for global styles
- Customize shadcn/ui components in `components/ui`

### 2. Content

- Update content through the admin panel
- Modify default content in Firebase
- Customize page layouts in `app` directory

### 3. Features

- Add new sections in `app` directory
- Create new components in `components` directory
- Extend Firebase functionality in `lib/firebase.ts`

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The project can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Digital Ocean
- Heroku

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email [your-email] or open an issue in the repository.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
