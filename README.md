# 居然好設計 Glow Design (Frontend)

## Overview

This project is an **interactive interior design tool** that allows users to design interior spaces with intuitive drag-and-drop functionality. The frontend is built with **TypeScript, Next.js, Redux, and Fabric.js**, providing a smooth and dynamic design experience.

The project is currently under development, with **85% of frontend functionalities completed**. Authentication is enabled, but it can be temporarily disabled for local testing.

## Features

### 🎨 **Design Features**

- **Wall Drawing:** Users can draw and adjust walls dynamically.
- **Floor Material Application:** Users can select and switch between different flooring materials.
- **Furniture Manipulation:** Drag, scale, and rotate furniture elements.
- **Grid-Based Snapping:** Ensures precise placement and alignment.
- **Canvas Navigation:** Supports panning and zooming for better visualization.
- **Undo/Redo Functionality:** Allows users to undo or redo actions, reducing errors.

### 📤 **Export & Sharing**

- **Flexible Export Options**: Users can export designs in A3, A4, or custom dimensions.

### 🚀 **Other Features**

- **SSR/SSG for Speed:** Uses Next.js Server-Side Rendering (SSR) and Static Site Generation (SSG) to optimize performance.
- **Authentication:** Supports JWT authentication and OAuth 2.0 (Google login and username/password login).

## Tech Stack

| Technology     | Purpose                                |
| -------------- | -------------------------------------- |
| **TypeScript** | Ensures type safety & maintainability  |
| **Next.js**    | Enhances performance with SSR/SSG      |
| **Redux**      | Manages global state efficiently       |
| **Fabric.js**  | Provides robust 2D canvas manipulation |

## Setup Instructions

### 🛠 **Run Locally**

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ALICE-YEN/glow-design-fe.git
cd glow-design-fe
```

#### 2️⃣ Install Dependencies

```bash
pnpm install
```

#### 3️⃣ Start the Development Server

```bash
pnpm dev
```

## Authentication Flow

- **For a detailed overview of the frontend-backend authentication flow, refer to the Sequence Diagram (`auth.wsd`).**

## Demo

🎥 **[Glow Design](https://www.youtube.com/watch?v=3YLgoK0buGw)**
[![IMAGE ALT TEXT](https://github.com/user-attachments/assets/ba0e6ced-9aeb-409e-9077-c240965cb375)](https://www.youtube.com/watch?v=3YLgoK0buGw "YOUR_VIDEO_TITLE")
