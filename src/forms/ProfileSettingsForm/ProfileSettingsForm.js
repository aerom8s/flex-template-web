import React, { Component } from 'react';
import { bool, string } from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { Field, Form as FinalForm } from 'react-final-form';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import { ensureCurrentUser } from '../../util/data';
import { propTypes } from '../../util/types';
import * as validators from '../../util/validators';
import { isUploadImageOverLimitError } from '../../util/errors';
import { Form, Avatar, Button, ImageFromFile, IconSpinner, FieldTextInput } from '../../components';
import { Dropdown, Menu } from 'semantic-ui-react'
import moment from 'moment'

import css from './ProfileSettingsForm.css';

const open = [
  { key: 1, text: 'Monday', value: 1 },
  { key: 2, text: 'Tuesday', value: 2 },
  { key: 3, text: 'Wednesday', value: 3 },
  { key: 4, text: 'Thursday', value: 4 },
  { key: 5, text: 'Friday', value: 5 },
  { key: 6, text: 'Saturday', value: 6 },
  { key: 7, text: 'Sunday', value: 7 },
]
const thru = [
  { key: 1, text: 'Monday', value: 1 },
  { key: 2, text: 'Tuesday', value: 2 },
  { key: 3, text: 'Wednesday', value: 3 },
  { key: 4, text: 'Thursday', value: 4 },
  { key: 5, text: 'Friday', value: 5 },
  { key: 6, text: 'Saturday', value: 6 },
  { key: 7, text: 'Sunday', value: 7 },
]

let timeCollection = [

]

const locale = 'en';
let timeTemp = {
  openHours: [],
  halfHours: [],
  key: 0,
  value: 0
}

moment.locale(locale);

for (let hour = 0; hour < 24; hour++) {
  timeTemp.key += 1
  timeTemp.value += 1
  timeTemp.openHours.push(timeTemp.key)
  timeTemp.openHours.push(moment({ hour }).format('h:mm A'));
  timeTemp.openHours.push(timeTemp.value)
  timeTemp.key += 1
  timeTemp.value += 1
  timeTemp.openHours.push(timeTemp.key)
  timeTemp.openHours.push(
    moment({
      hour,
      minute: 30
    }).format('h:mm A')
  );
  timeTemp.openHours.push(timeTemp.value)
}

for (let count = 0; count < timeTemp.openHours.length; count++) {
  if (typeof timeTemp.openHours[count] === "string") {
    // console.log(timeTemp.openHours[count], "Count")
    timeCollection.push({
      text: timeTemp.openHours[count],
      key: timeTemp.openHours[count - 1],
      value: timeTemp.openHours[count + 1]
    })
  }

  // console.log(timeTemp.openHours[count], "Count")
}

// console.log(timeTemp.openHours)
console.log(timeCollection)

const ACCEPT_IMAGES = 'image/*';
const UPLOAD_CHANGE_DELAY = 2000; // Show spinner so that browser has time to load img srcset

class ProfileSettingsFormComponent extends Component {
  constructor(props) {
    super(props);

    this.uploadDelayTimeoutId = null;
    this.state = { uploadDelay: false };
    this.submittedValues = {};
  }

  componentDidUpdate(prevProps) {
    // Upload delay is additional time window where Avatar is added to the DOM,
    // but not yet visible (time to load image URL from srcset)
    if (prevProps.uploadInProgress && !this.props.uploadInProgress) {
      this.setState({ uploadDelay: true });
      this.uploadDelayTimeoutId = window.setTimeout(() => {
        this.setState({ uploadDelay: false });
      }, UPLOAD_CHANGE_DELAY);
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.uploadDelayTimeoutId);
  }

  render() {
    return (
      <FinalForm
        {...this.props}
        render={fieldRenderProps => {
          const {
            className,
            currentUser,
            handleSubmit,
            intl,
            invalid,
            onImageUpload,
            pristine,
            profileImage,
            rootClassName,
            updateInProgress,
            updateProfileError,
            uploadImageError,
            uploadInProgress,
            form,
            values,
          } = fieldRenderProps;

          const user = ensureCurrentUser(currentUser);

          // First name
          const firstNameLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.firstNameLabel',
          });
          const firstNamePlaceholder = intl.formatMessage({
            id: 'ProfileSettingsForm.firstNamePlaceholder',
          });
          const websiteUrlLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.websiteUrlLabel',
          });
          const addressLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.addressLabel',
          });
          const addressPlaceholder = intl.formatMessage({
            id: 'ProfileSettingsForm.addressPlaceholder',
          });
          const websiteUrlPlaceholder = intl.formatMessage({
            id: 'ProfileSettingsForm.websiteUrlPlaceholder',
          });
          const twitterLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.twitterLabel',
          });
          const instagramLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.instagramLabel',
          });
          const linkedInLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.linkedInLabel',
          });
          const twitterPlaceholder = intl.formatMessage({
            id: 'ProfileSettingsForm.twitterPlaceholder',
          });
          const facebookLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.facebookLabel',
          });
          const firstNameExtra = intl.formatMessage({
            id: 'ProfileSettingsForm.nameExtra',
          });
          const firstNameRequiredMessage = intl.formatMessage({
            id: 'ProfileSettingsForm.firstNameRequired',
          });
          const firstNameRequired = validators.required(firstNameRequiredMessage);

          // Last name
          const lastNameLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.lastNameLabel',
          });
          const lastNamePlaceholder = intl.formatMessage({
            id: 'ProfileSettingsForm.lastNamePlaceholder',
          });
          const lastNameRequiredMessage = intl.formatMessage({
            id: 'ProfileSettingsForm.lastNameRequired',
          });
          const lastNameRequired = validators.required(lastNameRequiredMessage);

          // Bio
          const bioLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.bioLabel',
          });
          const bioPlaceholder = intl.formatMessage({
            id: 'ProfileSettingsForm.bioPlaceholder',
          });

          const uploadingOverlay =
            uploadInProgress || this.state.uploadDelay ? (
              <div className={css.uploadingImageOverlay}>
                <IconSpinner />
              </div>
            ) : null;

          const hasUploadError = !!uploadImageError && !uploadInProgress;
          const errorClasses = classNames({ [css.avatarUploadError]: hasUploadError });
          const transientUserProfileImage = profileImage.uploadedImage || user.profileImage;
          const transientUser = { ...user, profileImage: transientUserProfileImage };

          // Ensure that file exists if imageFromFile is used
          const fileExists = !!profileImage.file;
          const fileUploadInProgress = uploadInProgress && fileExists;
          const delayAfterUpload = profileImage.imageId && this.state.uploadDelay;
          const imageFromFile =
            fileExists && (fileUploadInProgress || delayAfterUpload) ? (
              <ImageFromFile
                id={profileImage.id}
                className={errorClasses}
                rootClassName={css.uploadingImage}
                aspectRatioClassName={css.squareAspectRatio}
                file={profileImage.file}
              >
                {uploadingOverlay}
              </ImageFromFile>
            ) : null;

          // Avatar is rendered in hidden during the upload delay
          // Upload delay smoothes image change process:
          // responsive img has time to load srcset stuff before it is shown to user.
          const avatarClasses = classNames(errorClasses, css.avatar, {
            [css.avatarInvisible]: this.state.uploadDelay,
          });
          const avatarComponent =
            !fileUploadInProgress && profileImage.imageId ? (
              <Avatar
                className={avatarClasses}
                renderSizes="(max-width: 767px) 96px, 240px"
                user={transientUser}
                disableProfileLink
              />
            ) : null;

          const chooseAvatarLabel =
            profileImage.imageId || fileUploadInProgress ? (
              <div className={css.avatarContainer}>
                {imageFromFile}
                {avatarComponent}
                <div className={css.changeAvatar}>
                  <FormattedMessage id="ProfileSettingsForm.changeAvatar" />
                </div>
              </div>
            ) : (
                <div className={css.avatarPlaceholder}>
                  <div className={css.avatarPlaceholderText}>
                    <FormattedMessage id="ProfileSettingsForm.addYourProfilePicture" />
                  </div>
                  <div className={css.avatarPlaceholderTextMobile}>
                    <FormattedMessage id="ProfileSettingsForm.addYourProfilePictureMobile" />
                  </div>
                </div>
              );

          const submitError = updateProfileError ? (
            <div className={css.error}>
              <FormattedMessage id="ProfileSettingsForm.updateProfileFailed" />
            </div>
          ) : null;

          const classes = classNames(rootClassName || css.root, className);
          const submitInProgress = updateInProgress;
          const submittedOnce = Object.keys(this.submittedValues).length > 0;
          const pristineSinceLastSubmit = submittedOnce && isEqual(values, this.submittedValues);
          const submitDisabled =
            invalid || pristine || pristineSinceLastSubmit || uploadInProgress || submitInProgress;

          return (
            <Form
              className={classes}
              onSubmit={e => {
                this.submittedValues = values;
                handleSubmit(e);
              }}
            >
              <div className={css.sectionContainer}>
                <h3 className={css.sectionTitle}>
                  <FormattedMessage id="ProfileSettingsForm.yourProfilePicture" />
                </h3>
                <Field
                  accept={ACCEPT_IMAGES}
                  id="profileImage"
                  name="profileImage"
                  label={chooseAvatarLabel}
                  type="file"
                  form={null}
                  uploadImageError={uploadImageError}
                  disabled={uploadInProgress}
                >
                  {fieldProps => {
                    const { accept, id, input, label, disabled, uploadImageError } = fieldProps;
                    const { name, type } = input;
                    const onChange = e => {
                      const file = e.target.files[0];
                      form.change(`profileImage`, file);
                      form.blur(`profileImage`);
                      if (file != null) {
                        const tempId = `${file.name}_${Date.now()}`;
                        onImageUpload({ id: tempId, file });
                      }
                    };

                    let error = null;

                    if (isUploadImageOverLimitError(uploadImageError)) {
                      error = (
                        <div className={css.error}>
                          <FormattedMessage id="ProfileSettingsForm.imageUploadFailedFileTooLarge" />
                        </div>
                      );
                    } else if (uploadImageError) {
                      error = (
                        <div className={css.error}>
                          <FormattedMessage id="ProfileSettingsForm.imageUploadFailed" />
                        </div>
                      );
                    }

                    return (
                      <div className={css.uploadAvatarWrapper}>
                        <label className={css.label} htmlFor={id}>
                          {label}
                        </label>
                        <input
                          accept={accept}
                          id={id}
                          name={name}
                          className={css.uploadAvatarInput}
                          disabled={disabled}
                          onChange={onChange}
                          type={type}
                        />
                        {error}
                      </div>
                    );
                  }}
                </Field>
                <div className={css.tip}>
                  <FormattedMessage id="ProfileSettingsForm.tip" />
                </div>
                <div className={css.fileInfo}>
                  <FormattedMessage id="ProfileSettingsForm.fileInfo" />
                </div>
              </div>
              <div className={css.sectionContainer}>
                <h3 className={css.sectionTitle}>
                  <FormattedMessage id="ProfileSettingsForm.yourName" />
                </h3>
                <div className={css.nameContainer}>
                  <FieldTextInput
                    className={css.firstName}
                    type="text"
                    id="firstName"
                    name="firstName"
                    label={firstNameLabel}
                    placeholder={firstNamePlaceholder}
                    validate={firstNameRequired}
                  />

                  {/* <FieldTextInput
                    className={css.lastName}
                    type="text"
                    id="lastName"
                    name="lastName"
                    label={lastNameLabel}
                    placeholder={lastNamePlaceholder}
                    validate={lastNameRequired}
                  /> */}
                </div>
                <h3 className={css.sectionTitle} style={{ marginTop: "2%" }}>
                  <FormattedMessage id="ProfileSettingsForm.nameExtra" />
                </h3>
              </div>
              <div className={classNames(css.sectionContainer)}>
                <h3 className={css.sectionTitle}>
                  <FormattedMessage id="ProfileSettingsForm.bioHeading" />
                </h3>
                <FieldTextInput
                  type="textarea"
                  className={css.textAreaStyle}
                  id="bio"
                  name="bio"
                  label={bioLabel}
                  placeholder={bioPlaceholder}
                />
              </div>
              <div className={classNames(css.sectionContainer)}>

                <h3 className={css.sectionTitle}>
                  <FormattedMessage id="ProfileSettingsForm.socialHeading" />
                </h3>
                <FieldTextInput
                  className={css.firstName}
                  type="text"
                  id="websiteURL"
                  name="websiteURL"
                  label={websiteUrlLabel}
                  placeholder={websiteUrlPlaceholder}
                // validate={websiteUrlRequired}
                />
                <br></br>
                <FieldTextInput
                  className={css.firstName}
                  type="text"
                  id="facebook"
                  name="facebook"
                  label={facebookLabel}
                  placeholder={websiteUrlPlaceholder}
                // validate={websiteUrlRequired}
                />
                <br></br>
                <FieldTextInput
                  className={css.firstName}
                  type="text"
                  id="twitter"
                  name="twitter"
                  label={twitterLabel}
                  placeholder={twitterPlaceholder}
                // validate={websiteUrlRequired}
                />
                <br></br>
                <FieldTextInput
                  className={css.firstName}
                  type="text"
                  id="instagram"
                  name="instagram"
                  label={instagramLabel}
                  placeholder={twitterPlaceholder}
                // validate={websiteUrlRequired}
                />
                <br></br>
                <FieldTextInput
                  className={css.firstName}
                  type="text"
                  id="linkedIn"
                  name="linkedIn"
                  label={linkedInLabel}
                  placeholder={websiteUrlPlaceholder}
                // validate={websiteUrlRequired}
                />
              </div>


              <h3 className={css.sectionTitle}>
                <FormattedMessage id="ProfileSettingsForm.businessHeading" />
              </h3>

              <Menu compact className={css.menuStyle}>
                <div>
                  <label className={css.menuLabel}>Open</label>
                  <Dropdown placeholder="Monday" options={open} item />
                </div>
                <div>
                  <label className={css.menuLabel}>Thru</label>
                  <Dropdown placeholder="Friday" options={thru} item />
                </div>
                <div>
                  <label className={css.menuLabel}>Open</label>
                  <Dropdown placeholder="7:30 AM" selection options={timeCollection} item />
                </div>
                <div>
                  <label className={css.menuLabel}>Close</label>
                  <Dropdown placeholder="8:00 PM" options={timeCollection} item />
                </div>
              </Menu>
              <br />
              <h3 className={css.sectionTitle}>
                <FormattedMessage id="ProfileSettingsForm.addTime" />
              </h3>

              <br />
              <br />
              <br />

              <div className={classNames(css.sectionContainer, css.lastSection)}>
                <h3 className={css.sectionTitle}>
                  <FormattedMessage id="ProfileSettingsForm.locationHeading" />
                </h3>

                <FieldTextInput
                  className={css.firstName}
                  type="text"
                  id="address"
                  name="address"
                  label={addressLabel}
                  placeholder={addressPlaceholder}
                // validate={websiteUrlRequired}
                />
              </div>


              {submitError}
              <Button
                className={css.submitButton}
                type="submit"
                inProgress={submitInProgress}
                disabled={submitDisabled}
                ready={pristineSinceLastSubmit}
              >
                <FormattedMessage id="ProfileSettingsForm.saveChanges" />
              </Button>
            </Form>
          );
        }}
      />
    );
  }
}

ProfileSettingsFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  uploadImageError: null,
  updateProfileError: null,
  updateProfileReady: false,
};

ProfileSettingsFormComponent.propTypes = {
  rootClassName: string,
  className: string,

  uploadImageError: propTypes.error,
  uploadInProgress: bool.isRequired,
  updateInProgress: bool.isRequired,
  updateProfileError: propTypes.error,
  updateProfileReady: bool,

  // from injectIntl
  intl: intlShape.isRequired,
};

const ProfileSettingsForm = compose(injectIntl)(ProfileSettingsFormComponent);

ProfileSettingsForm.displayName = 'ProfileSettingsForm';

export default ProfileSettingsForm;
