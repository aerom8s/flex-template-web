/* eslint-disable no-console */
import EditAircraftDescriptionFormComponent from './EditAircraftDescriptionForm';

export const Empty = {
  component: EditAircraftDescriptionFormComponent,
  props: {
    onSubmit: values => {
      console.log('Submit EditAircraftDescriptionFormComponent with (unformatted) values:', values);
    },
    saveActionMsg: 'Save description',
    updated: false,
    updateInProgress: false,
  },
  group: 'forms',
};
