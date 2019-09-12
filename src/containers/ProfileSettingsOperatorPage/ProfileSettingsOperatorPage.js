import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { ensureCurrentUser } from '../../util/data';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import {
  Page,
  UserNav,
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  NamedLink,
} from '../../components';
import { ProfileSettingsOperatorForm } from '../../forms';
import { TopbarContainer } from '..';

import { updateProfile, uploadImage } from './ProfileSettingsOperatorPage.duck';
import css from './ProfileSettingsOperatorPage.css';

const onImageUploadHandler = (values, fn) => {
  const { id, imageId, file } = values;
  if (file) {
    fn({ id, imageId, file });
  }
};

export class ProfileSettingsPageComponent extends Component {
  render() {
    const {
      currentUser,
      image,
      onImageUpload,
      onUpdateProfile,
      scrollingDisabled,
      updateInProgress,
      updateProfileError,
      uploadImageError,
      uploadInProgress,
      intl,
    } = this.props;

    const handleSubmit = values => {
      // these are all values from form changed for operator
      const {
        address,
        bio: rawBio,
        closeHours,
        companyName,
        facebook,
        instagram,
        linkedin,
        openHours,
        twitter,
        websiteUrl,
        thruDays,
        openDays,
      } = values;

      // Ensure that the optional bio is a string
      const bio = rawBio || '';

      const profile = {
        bio,
        displayName: companyName,
        // public data for all inputs in form besides above
        publicData: {
          address: address || '',
          // hoursOfOps is an array so
          // +add creates multipl objects
          // when implemented
          hoursOfOps: [
            {
              openHours: openHours || '',
              thruDays: thruDays || '',
              openDays: openDays || '',
              closeHours: closeHours || '',
            },
          ],
          // list of all social media accounts
          social: {
            linkedin: linkedin || '',
            facebook: facebook || '',
            instagram: instagram || '',
            twitter: twitter || '',
            websiteUrl: websiteUrl || '',
          },
        },
      };
      const uploadedImage = this.props.image;

      // Update profileImage only if file system has been accessed
      const updatedValues =
        uploadedImage && uploadedImage.imageId && uploadedImage.file
          ? { ...profile, profileImageId: uploadedImage.imageId }
          : profile;

      onUpdateProfile(updatedValues);
    };

    const user = ensureCurrentUser(currentUser);
    const { displayName, bio, publicData } = user.attributes.profile;
    let initial = {};
    // profile comes back empty on first pass
    // check for public data before destructuring
    if (publicData) {
      const { address, hoursOfOps, social } = publicData;
      if (hoursOfOps && hoursOfOps[0]) {
        const { thruDays, openDays, openHours, closeHours } = hoursOfOps[0];
        initial.thruDays = thruDays;
        initial.openDays = openDays;
        initial.openHours = openHours;
        initial.closeHours = closeHours;
      }
      if (social) {
        const { facebook, instagram, linkedin, twitter, websiteUrl } = social;
        // set all needed data from public data
        // to be displayed here
        initial.address = address;
        initial.facebook = facebook;
        initial.instagram = instagram;
        initial.linkedin = linkedin;
        initial.twitter = twitter;
        initial.websiteUrl = websiteUrl;
      }
    }
    const profileImageId = user.profileImage ? user.profileImage.id : null;
    const profileImage = image || { imageId: profileImageId };

    const profileSettingsForm = user.id ? (
      <ProfileSettingsOperatorForm
        className={css.form}
        currentUser={currentUser}
        initialValues={{
          companyName: displayName,
          bio,
          profileImage: user.profileImage,
          // spread initial for all publicData displayed
          ...initial,
        }}
        profileImage={profileImage}
        onImageUpload={e => onImageUploadHandler(e, onImageUpload)}
        uploadInProgress={uploadInProgress}
        updateInProgress={updateInProgress}
        uploadImageError={uploadImageError}
        updateProfileError={updateProfileError}
        onSubmit={handleSubmit}
      />
    ) : null;

    const title = intl.formatMessage({ id: 'ProfileSettingsPage.title' });

    return (
      <Page className={css.root} title={title} scrollingDisabled={scrollingDisabled}>
        <LayoutSingleColumn>
          <LayoutWrapperTopbar>
            <TopbarContainer currentPage="ProfileSettingsPage" />
            <UserNav selectedPageName="ProfileSettingsPage" />
          </LayoutWrapperTopbar>
          <LayoutWrapperMain>
            <div className={css.content}>
              <div className={css.headingContainer}>
                <h1 className={css.heading}>
                  <FormattedMessage id="ProfileSettingsPage.heading" />
                </h1>
                {user.id ? (
                  <NamedLink
                    className={css.profileLink}
                    name="ProfilePage"
                    params={{ id: user.id.uuid }}
                  >
                    <FormattedMessage id="ProfileSettingsPage.viewProfileLink" />
                  </NamedLink>
                ) : null}
              </div>
              {profileSettingsForm}
            </div>
          </LayoutWrapperMain>
          <LayoutWrapperFooter>
            <Footer />
          </LayoutWrapperFooter>
        </LayoutSingleColumn>
      </Page>
    );
  }
}

ProfileSettingsPageComponent.defaultProps = {
  currentUser: null,
  uploadImageError: null,
  updateProfileError: null,
  image: null,
};

const { bool, func, object, shape, string } = PropTypes;

ProfileSettingsPageComponent.propTypes = {
  currentUser: propTypes.currentUser,
  image: shape({
    id: string,
    imageId: propTypes.uuid,
    file: object,
    uploadedImage: propTypes.image,
  }),
  onImageUpload: func.isRequired,
  onUpdateProfile: func.isRequired,
  scrollingDisabled: bool.isRequired,
  updateInProgress: bool.isRequired,
  updateProfileError: propTypes.error,
  uploadImageError: propTypes.error,
  uploadInProgress: bool.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const { currentUser } = state.user;
  const {
    image,
    uploadImageError,
    uploadInProgress,
    updateInProgress,
    updateProfileError,
  } = state.ProfileSettingsPage;
  return {
    currentUser,
    image,
    scrollingDisabled: isScrollingDisabled(state),
    updateInProgress,
    updateProfileError,
    uploadImageError,
    uploadInProgress,
  };
};

const mapDispatchToProps = dispatch => ({
  onImageUpload: data => dispatch(uploadImage(data)),
  onUpdateProfile: data => dispatch(updateProfile(data)),
});

const ProfileSettingsPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(ProfileSettingsPageComponent);

export default ProfileSettingsPage;
