import React from 'react';
import { renderDeep } from '../../util/test-helpers';
import { fakeIntl } from '../../util/test-data';
import EditAircraftPricingForm from './EditAircraftPricingForm';

const noop = () => null;

describe('EditListingPricingForm', () => {
  it('matches snapshot', () => {
    const tree = renderDeep(
      <EditAircraftPricingForm
        intl={fakeIntl}
        dispatch={noop}
        onSubmit={v => v}
        saveActionMsg="Save price"
        updated={false}
        updateInProgress={false}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
