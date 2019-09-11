import React from 'react';
import { bool, func, object, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { ensureOwnListing } from '../../util/data';
import { ListingLink } from '../../components';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { EditAircraftDescriptionForm } from '../../forms';
import config from '../../config';

import css from './EditListingDescriptionPanel.css';

const EditListingDescriptionPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const {
    make,
    model,
    numberOfSeats,
    aircraftYear,
    aircraftType,
  } = currentListing.attributes.publicData;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingDescriptionPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    <FormattedMessage id="EditListingDescriptionPanel.createListingTitle" />
  );
  console.log(currentListing);
  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <EditAircraftDescriptionForm
        className={css.form}
        initialValues={{ make, model, numberOfSeats, aircraftYear, aircraftType }}
        saveActionMsg={submitButtonText}
        onSubmit={values => {
          const { make, model, numberOfSeats, aircraftYear, aircraftType } = values;
          const updateValues = {
            title: `${make}, ${model}, ${aircraftType}, ${aircraftYear}`,
            publicData: {
              make: make.trim(),
              model: model.trim(),
              numberOfSeats,
              aircraftYear,
              aircraftType,
            },
          };

          onSubmit(updateValues);
        }}
        onChange={onChange}
        updated={panelUpdated}
        updateInProgress={updateInProgress}
        fetchErrors={errors}
        categories={config.custom.categories}
      />
    </div>
  );
};

EditListingDescriptionPanel.defaultProps = {
  className: null,
  rootClassName: null,
  errors: null,
  listing: null,
};

EditListingDescriptionPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingDescriptionPanel;
