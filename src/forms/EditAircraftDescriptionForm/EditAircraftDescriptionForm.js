import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { maxLength, required, composeValidators } from '../../util/validators';
import { Form, Button, FieldTextInput, FieldSelect } from '../../components';
import moment from 'moment';
import { default as aircraftTypes } from './aircraft-types';

import css from './EditAircraftDescriptionForm.css';

const TITLE_MAX_LENGTH = 60;

const EditAircraftDescriptionFormComponent = props => {
  return (
    <FinalForm
      {...props}
      render={fieldRenderProps => {
        const {
          className,
          disabled,
          handleSubmit,
          intl,
          invalid,
          pristine,
          saveActionMsg,
          updated,
          updateInProgress,
          fetchErrors,
        } = fieldRenderProps;

        // ****************************
        // create list for select,
        // add isYear to count down
        // years instead of numbers
        // ****************************
        const createList = (num, isYear) => {
          let options = [];
          const year = moment().year();
          let currYear = year;
          for (num; num > 0; num--) {
            if (isYear) {
              options.push(
                <option value={currYear} key={currYear} name="years">
                  {currYear}
                </option>
              );

              currYear = currYear - 1;
            } else {
              options.push(
                <option value={num} key={`${num} seats`} name="seats">
                  {num}
                </option>
              );
            }
          }
          if (!isYear) return options.reverse();
          return options;
        };

        const makeMessage = intl.formatMessage({ id: 'EditAircraftDescriptionForm.make' });
        const makePlaceholderMessage = intl.formatMessage({
          id: 'EditAircraftDescriptionForm.makePlaceholder',
        });
        const makeRequiredMessage = intl.formatMessage({
          id: 'EditAircraftDescriptionForm.makeRequired',
        });
        const maxLengthMessage = intl.formatMessage(
          { id: 'EditAircraftDescriptionForm.maxLength' },
          {
            maxLength: TITLE_MAX_LENGTH,
          }
        );

        const modelMessage = intl.formatMessage({
          id: 'EditAircraftDescriptionForm.description',
        });
        const modelPlaceholderMessage = intl.formatMessage({
          id: 'EditAircraftDescriptionForm.descriptionPlaceholder',
        });
        const maxLength60Message = maxLength(maxLengthMessage, TITLE_MAX_LENGTH);
        const modelRequiredMessage = intl.formatMessage({
          id: 'EditAircraftDescriptionForm.descriptionRequired',
        });

        const { updateListingError, createListingDraftError, showListingsError } =
          fetchErrors || {};
        const errorMessageUpdateListing = updateListingError ? (
          <p className={css.error}>
            <FormattedMessage id="EditAircraftDescriptionForm.updateFailed" />
          </p>
        ) : null;

        // This error happens only on first tab (of EditListingWizard)
        const errorMessageCreateListingDraft = createListingDraftError ? (
          <p className={css.error}>
            <FormattedMessage id="EditAircraftDescriptionForm.createListingDraftError" />
          </p>
        ) : null;

        const errorMessageShowListing = showListingsError ? (
          <p className={css.error}>
            <FormattedMessage id="EditAircraftDescriptionForm.showListingFailed" />
          </p>
        ) : null;

        const classes = classNames(css.root, className);
        const submitReady = updated && pristine;
        const submitInProgress = updateInProgress;
        const submitDisabled = invalid || disabled || submitInProgress;
        return (
          <Form className={classes} onSubmit={handleSubmit}>
            {errorMessageCreateListingDraft}
            {errorMessageUpdateListing}
            {errorMessageShowListing}

            <FormSpy onChange={e => console.log(e)} />
            <FieldTextInput
              id="make"
              name="make"
              className={css.make}
              type="text"
              label={makeMessage}
              placeholder={makePlaceholderMessage}
              maxLength={TITLE_MAX_LENGTH}
              validate={composeValidators(required(makeRequiredMessage), maxLength60Message)}
              autoFocus
            />

            <FieldTextInput
              id="model"
              name="model"
              className={css.description}
              type="text"
              label={modelMessage}
              placeholder={modelPlaceholderMessage}
              validate={composeValidators(required(modelRequiredMessage))}
            />

            {/* Create aircraft year list  */}
            <FieldSelect
              id="numberOfSeats"
              name="numberOfSeats"
              label="Number of Seats"
              validate={required('This field is required')}
            >
              <option>Select</option>
              {createList(20, false)}
            </FieldSelect>

            {/* Create aircraft year list  */}
            <FieldSelect
              id="aircraftYear"
              name="aircraftYear"
              label="Year*"
              validate={required('This field is required')}
            >
              <option>Select</option>
              {createList(40, true)}
            </FieldSelect>

            {/* Field select added for aircraft types
              Please refer ./aircraft-types.js for array of aircrafts
          */}
            <FieldSelect
              id="aircraftType"
              name="aircraftType"
              label="Aircraft Type"
              validate={required('This field is required')}
            >
              <option>Select</option>
              {aircraftTypes &&
                aircraftTypes.map(type => (
                  <option value={type} key={type}>
                    {type}
                  </option>
                ))}
            </FieldSelect>

            <Button
              className={css.submitButton}
              type="submit"
              inProgress={submitInProgress}
              disabled={submitDisabled}
              ready={submitReady}
            >
              {saveActionMsg}
            </Button>
          </Form>
        );
      }}
    />
  );
};

EditAircraftDescriptionFormComponent.defaultProps = { className: null, fetchErrors: null };

EditAircraftDescriptionFormComponent.propTypes = {
  className: string,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    createListingDraftError: propTypes.error,
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
};

export default compose(injectIntl)(EditAircraftDescriptionFormComponent);
