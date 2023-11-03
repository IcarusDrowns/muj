// pages/upload.tsx

import React from 'react';
import AdminVideoUpload from '../components/AdminVideoUpload';
import { getSession, useSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';

const UploadPage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // Render the upload form only if the user is logged in and is an admin
  if (session?.user?.role === 'admin') {
    return <AdminVideoUpload />;
  }

  // If not admin or not logged in, show a message or redirect
  return (
    <div>
      <p>You must be an admin to view this page.</p>
    </div>
  );
};

export default UploadPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the user's session based on the request
  const session = await getSession({ req: context.req });

  // Check if the session exists and if the user has the admin role
  if (!session || !session.user || session.user.role !== 'admin') {
    // If not an admin, redirect to the sign-in page
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // If the user is an admin, return the session
  return {
    props: { session },
  };
};
