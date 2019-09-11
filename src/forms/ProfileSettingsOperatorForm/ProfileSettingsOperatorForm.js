import React, { Component } from 'react';
import { bool, string } from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Field, Form as FinalForm } from 'react-final-form';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import { ensureCurrentUser } from '../../util/data';
import config from '../../config';
import { propTypes } from '../../util/types';
import { isUploadImageOverLimitError } from '../../util/errors';
import {
  Form,
  Avatar,
  Button,
  ImageFromFile,
  IconSpinner,
  FieldTextInput,
  FieldSelect,
} from '../../components';

import css from './ProfileSettingsOperatorForm.css';
const { daysOfWeek } = config.custom;
const ACCEPT_IMAGES = 'image/*';
const UPLOAD_CHANGE_DELAY = 2000; // Show spinner so that browser has time to load img srcset

class ProfileSettingsFormComponent extends Component {
  constructor(props) {
    super(props);

    this.uploadDelayTimeoutId = null;
    this.state = { uploadDelay: false, hoursCount: 0, extraHours: [] };
    this.submittedValues = {};
  }

  componentWillReceiveProps(nextProps) {
    // Upload delay is additional time window where Avatar is added to the DOM,
    // but not yet visible (time to load image URL from srcset)
    if (this.props.uploadInProgress && !nextProps.uploadInProgress) {
      this.setState({ uploadDelay: true });
      this.uploadDelayTimeoutId = window.setTimeout(() => {
        this.setState({ uploadDelay: false });
      }, UPLOAD_CHANGE_DELAY);
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.blurTimeoutId);
  }
  getExtraHours = hoursOfOps => {
    const { hoursCount, extraHours } = this.state;
    const { openHours, closeHours } = hoursOfOps;
    const { openHoursPlaceholder, openHoursLabel } = openHours;
    const { closeHoursPlaceholder, closeHoursLabel } = closeHours;
    extraHours.push(
      <div className={css.nameContainer}>
        <FieldSelect
          id={`openDays-${hoursCount}`}
          name={`openDays-${hoursCount}`}
          label="Open"
          placeholder="Monday"
        >
          {daysOfWeek.map(day => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </FieldSelect>
        <FieldSelect
          id={`thruDays-${hoursCount}`}
          name={`thruDays-${hoursCount}`}
          label="Thru"
          placeholder="Friday"
        >
          {daysOfWeek.map(day => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </FieldSelect>
        <FieldTextInput
          type="text"
          id={`openHours-${hoursCount}`}
          name={`openHours-${hoursCount}`}
          label={openHoursLabel}
          placeholder={openHoursPlaceholder}
        />
        <FieldTextInput
          type="text"
          id={`closeHours-${hoursCount}`}
          name={`closeHours-${hoursCount}`}
          label={closeHoursLabel}
          placeholder={closeHoursPlaceholder}
        />
      </div>
    );
    this.setState({
      hoursCount: hoursCount + 1,
      extraHours,
    });
  };

  render() {
    const props = {
      ...this.props,
      getExtraHours: this.getExtraHours,
      extraHours: this.state.extraHours,
    };
    return (
      <FinalForm
        {...props}
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
            getExtraHours,
            extraHours,
          } = fieldRenderProps;

          const user = ensureCurrentUser(currentUser);

          // company name / display name
          const companyNameLabel = intl.formatMessage({
            id: 'ProfileSettingsOperatorForm.companyNameLabel',
          });
          const companyNamePlaceholder = intl.formatMessage({
            id: 'ProfileSettingsOperatorForm.companyNamePlaceholder',
          });

          // Bio
          const bioLabel = intl.formatMessage({
            id: 'ProfileSettingsOperatorForm.bioLabel',
          });
          const bioPlaceholder = intl.formatMessage({
            id: 'ProfileSettingsOperatorForm.bioPlaceholder',
          });

          // Website Input
          const websiteLabel = intl.formatMessage({
            id: 'ProfileSettingsOperatorForm.websiteLabel',
          });
          const websitePlaceholder = intl.formatMessage({
            id: 'ProfileSettingsOperatorForm.websitePlaceholder',
          });

          // Facebook
          const facebookLabel = intl.formatMessage({
            id: 'ProfileSettingsOperatorForm.facebookLabel',
          });
          const facebookPlaceholder = intl.formatMessage({
            id: 'ProfileSettingsOperatorForm.facebookPlaceholder',
          });

          // Twitter
          const twitterLabel = intl.formatMessage({
            id: 'ProfileSettingsOperatorForm.twitterLabel',
          });
          const twitterPlaceholder = intl.formatMessage({
            id: 'ProfileSettingsOperatorForm.twitterPlaceholder',
          });

          // Instagram
          const instagramLabel = intl.formatMessage({
            id: 'ProfileSettingsOperatorForm.instagramLabel',
          });
          const instagramPlaceholder = intl.formatMessage({
            id: 'ProfileSettingsOperatorForm.instagramPlaceholder',
          });

          // LinkedIn
          const linkedinLabel = intl.formatMessage({
            id: 'ProfileSettingsOperatorForm.linkedinLabel',
          });
          const linkedinPlaceholder = intl.formatMessage({
            id: 'ProfileSettingsOperatorForm.linkedinPlaceholder',
          });

          // Address
          const addressLabel = intl.formatMessage({
            id: 'ProfileSettingsOperatorForm.addressLabel',
          });
          const addressPlaceholder = intl.formatMessage({
            id: 'ProfileSettingsOperatorForm.addressPlaceholder',
          });

          // Open Hours
          const openHoursLabel = intl.formatMessage({
            id: 'ProfileSettingsOperatorForm.openHoursLabel',
          });
          const openHoursPlaceholder = intl.formatMessage({
            id: 'ProfileSettingsOperatorForm.openHoursPlaceholder',
          });

          // Close Hours
          const closeHoursLabel = intl.formatMessage({
            id: 'ProfileSettingsOperatorForm.closeHoursLabel',
          });
          const closeHoursPlaceholder = intl.formatMessage({
            id: 'ProfileSettingsOperatorForm.closeHoursPlaceholder',
          });

          // labels and placeholders to dynamically add another hours of operations
          const hoursOfOps = {
            openHours: {
              openHoursLabel,
              openHoursPlaceholder,
            },
            closeHours: {
              closeHoursLabel,
              closeHoursPlaceholder,
            },
          };

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
                  <FormattedMessage id="ProfileSettingsOperatorForm.addYourProfilePicture" />
                </div>
                <div className={css.avatarPlaceholderTextMobile}>
                  <FormattedMessage id="ProfileSettingsOperatorForm.addYourProfilePictureMobile" />
                </div>
              </div>
            );

          const submitError = updateProfileError ? (
            <div className={css.error}>
              <FormattedMessage id="ProfileSettingsOperatorForm.updateProfileFailed" />
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
                  <FormattedMessage id="ProfileSettingsOperatorForm.yourProfilePicture" />
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
                    const {
                      accept,
                      id,
                      input,
                      label,
                      type,
                      disabled,
                      uploadImageError,
                    } = fieldProps;
                    const { name } = input;
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
                          <FormattedMessage id="ProfileSettingsOperatorForm.imageUploadFailedFileTooLarge" />
                        </div>
                      );
                    } else if (uploadImageError) {
                      error = (
                        <div className={css.error}>
                          <FormattedMessage id="ProfileSettingsOperatorForm.imageUploadFailed" />
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
                  <FormattedMessage id="ProfileSettingsOperatorForm.tip" />
                </div>
                <div className={css.fileInfo}>
                  <FormattedMessage id="ProfileSettingsOperatorForm.fileInfo" />
                </div>
              </div>
              <div className={css.sectionContainer}>
                <h3 className={css.sectionTitle}>
                  <FormattedMessage id="ProfileSettingsOperatorForm.yourName" />
                </h3>
                <FieldTextInput
                  type="text"
                  id="companyName"
                  name="companyName"
                  label={companyNameLabel}
                  placeholder={companyNamePlaceholder}
                />
              </div>
              <div className={classNames(css.sectionContainer)}>
                <h3 className={css.sectionTitle}>
                  <FormattedMessage id="ProfileSettingsOperatorForm.bioHeading" />
                </h3>
                <FieldTextInput
                  type="textarea"
                  id="bio"
                  name="bio"
                  label={bioLabel}
                  placeholder={bioPlaceholder}
                />
              </div>
              {/* add social media container */}
              <div className={classNames(css.sectionContainer)}>
                <h3 className={css.sectionTitle}>
                  <FormattedMessage id="ProfileSettingsOperatorForm.SocialHeading" />
                </h3>
                <FieldTextInput
                  type="text"
                  id="websiteUrl"
                  name="websiteUrl"
                  label={websiteLabel}
                  placeholder={websitePlaceholder}
                />
                <FieldTextInput
                  type="text"
                  id="facebook"
                  name="facebook"
                  label={facebookLabel}
                  placeholder={facebookPlaceholder}
                />
                <FieldTextInput
                  type="text"
                  id="twitter"
                  name="twitter"
                  label={twitterLabel}
                  placeholder={twitterPlaceholder}
                />
                <FieldTextInput
                  type="text"
                  id="instagram"
                  name="instagram"
                  label={instagramLabel}
                  placeholder={instagramPlaceholder}
                />
                <FieldTextInput
                  type="text"
                  id="linkedin"
                  name="linkedin"
                  label={linkedinLabel}
                  placeholder={linkedinPlaceholder}
                />
              </div>
              {/* add business hours section */}
              <div className={classNames(css.sectionContainer)}>
                <h3 className={css.sectionTitle}>
                  <FormattedMessage id="ProfileSettingsOperatorForm.businessHoursHeading" />
                </h3>
                <div className={css.nameContainer}>
                  <FieldSelect id="openDays" name="openDays" label="Open" placeholder="Monday">
                    {daysOfWeek.map(day => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </FieldSelect>
                  <FieldSelect id="thruDays" name="thruDays" label="Thru" placeholder="Friday">
                    {daysOfWeek.map(day => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </FieldSelect>
                  <FieldTextInput
                    type="text"
                    id="openHours"
                    name="openHours"
                    label={openHoursLabel}
                    placeholder={openHoursPlaceholder}
                  />
                  <FieldTextInput
                    type="text"
                    id="closeHours"
                    name="closeHours"
                    label={closeHoursLabel}
                    placeholder={closeHoursPlaceholder}
                  />
                </div>
                {/* temp placeholder for +add */}
                {extraHours && extraHours.map(hours => hours)}
                <div role="presentation" onClick={() => getExtraHours(hoursOfOps)}>
                  +Add
                </div>
              </div>
              {/* add location section */}
              <div className={classNames(css.sectionContainer, css.lastSection)}>
                <h3 className={css.sectionTitle}>
                  <FormattedMessage id="ProfileSettingsOperatorForm.locationHeading" />
                </h3>
                <FieldTextInput
                  type="textarea"
                  id="address"
                  name="address"
                  label={addressLabel}
                  placeholder={addressPlaceholder}
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
                <FormattedMessage id="ProfileSettingsOperatorForm.saveChanges" />
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
