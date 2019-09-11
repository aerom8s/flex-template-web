/* eslint-disable no-console */
import EditAircraftPricingForm from './EditAircraftPricingForm';

export const Empty = {
  component: EditAircraftPricingForm,
  props: {
    onSubmit: values => {
      console.log('Submit EditListingPricingForm with (unformatted) values:', values);
    },
    saveActionMsg: 'Save price',
    updated: false,
    updateInProgress: false,
  },
  group: 'forms',
};
