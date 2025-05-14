import React from 'react';
import { Grid } from '@mui/material';
import PageContainer from '../../../components/container/PageContainer';

import ProfileBanner from 'src/components/apps/userprofile/profile/ProfileBanner';




const UserProfile = () => {
  return (
    <PageContainer title="User Profile" description="this is User Profile page">

      <Grid container spacing={3}>
        <Grid item sm={12}>
          <ProfileBanner />
        </Grid>

        {/* intro and Photos Card */}
        
        
       
      </Grid>
    </PageContainer>
  );
};

export default UserProfile;
