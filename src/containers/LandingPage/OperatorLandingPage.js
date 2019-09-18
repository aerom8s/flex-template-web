import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { injectIntl, intlShape } from '../../util/reactIntl';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import config from '../../config';
import {
    Page,
    SectionHero,
    SectionHowItWorks,
    SectionLocations,
    LayoutSingleColumn,
    LayoutWrapperTopbar,
    LayoutWrapperMain,
    LayoutWrapperFooter,
    Footer,
} from '../../components';
import { TopbarContainer } from '../../containers';
import { Container, Image, Header, Button } from 'semantic-ui-react'
import operatorHero from '../../assets/operatorHero.jpg'

import facebookImage from '../../assets/saunatimeFacebook-1200x630.jpg';
import twitterImage from '../../assets/saunatimeTwitter-600x314.jpg';
import tempImage from '../../assets/placeholder.png'
import css from './OperatorLandingPage.css';

export const LandingPageComponent = props => {
    const { history, intl, location, scrollingDisabled } = props;

    // Schema for search engines (helps them to understand what this page is about)
    // http://schema.org
    // We are using JSON-LD format
    const siteTitle = config.siteTitle;
    const schemaTitle = intl.formatMessage({ id: 'LandingPage.schemaTitle' }, { siteTitle });
    const schemaDescription = intl.formatMessage({ id: 'LandingPage.schemaDescription' });
    const schemaImage = `${config.canonicalRootURL}${facebookImage}`;

    return (
        <Page
            className={css.root}
            scrollingDisabled={scrollingDisabled}
            contentType="website"
            description={schemaDescription}
            title={schemaTitle}
            facebookImages={[{ url: facebookImage, width: 1200, height: 630 }]}
            twitterImages={[
                { url: `${config.canonicalRootURL}${twitterImage}`, width: 600, height: 314 },
            ]}
            schema={{
                '@context': 'http://schema.org',
                '@type': 'WebPage',
                description: schemaDescription,
                name: schemaTitle,
                image: [schemaImage],
            }}
        >
            <LayoutSingleColumn>
                <LayoutWrapperTopbar>
                    <TopbarContainer />
                </LayoutWrapperTopbar>
                <LayoutWrapperMain>
                    <Container fluid>
                        <Image className={css.operatorHeroStyle} src={operatorHero} fluid />
                        <Header className={css.operatorHeroHeader} as='h1'>Private aviation, <br /> simplified.</Header>
                        <p className={css.operatorHeroPara}>Aeromates powers the nation's top aviation operators, <br /> using technology to build
                        the future of the industry.</p>
                        <Button className={css.operatorHeroBtn} primary>Request a Demo</Button>
                        <div className={css.operatorContainerDiv}>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <h2 className={css.operatorHeader}>How does it work?</h2>
                            </div>
                            <div className={css.imageContainer}>
                                <div className={css.cardContainer}>
                                    <img className={css.imgStyle} src={tempImage} alt="student at desk" />
                                    <h3>Create a custom profile for your company.</h3>
                                </div>
                                <div className={css.cardContainer}>
                                    <img className={css.imgStyle} src={tempImage} alt="student at desk" />
                                    <h3>Easily enter your aircraft, and <br /> and
                                    set booking times for chartes, <br />
                                        tours or training.</h3>
                                </div>
                                <div className={css.cardContainer}>
                                    <img className={css.imgStyle} src={tempImage} alt="student at desk" />
                                    <h3>That's it, you're open <br />
                                        for Business.</h3>
                                </div>
                            </div>

                            <div className={css.nextSection}>
                                <div style={{ display: "flex", justifyContent: "center" }}>

                                    <h2 className={css.operatorHeader2}>Why Aeromates?</h2>
                                </div>

                                <div className={css.customerContainer}>

                                    <div className={css.customerCard}>
                                        <div className={css.customerCardInfo}>
                                            <h2 className={css.customerCardHeader}>Own your <br /> customers</h2>
                                            <p className={css.customerCardPara}>Our best-in-class CRM comes standard, to <br />
                                                make communicating with your customers <br />
                                                easier than ever. Plus gain a greater insight <br />
                                                into your business with our marketing <br />
                                                analytics dashboard, at a level never before <br />
                                                seen in the aviation industry.</p>
                                        </div>
                                        <img className={css.customerImage} src={tempImage} alt="tour pending / confirmed" />

                                    </div>

                                </div>
                            </div>
                        </div>
                    </Container>
                </LayoutWrapperMain>
                <LayoutWrapperFooter>
                    <Footer />
                </LayoutWrapperFooter>
            </LayoutSingleColumn>
        </Page>
    );
};

const { bool, object } = PropTypes;

LandingPageComponent.propTypes = {
    scrollingDisabled: bool.isRequired,

    // from withRouter
    history: object.isRequired,
    location: object.isRequired,

    // from injectIntl
    intl: intlShape.isRequired,
};

const mapStateToProps = state => {
    return {
        scrollingDisabled: isScrollingDisabled(state),
    };
};

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const LandingPage = compose(
    withRouter,
    connect(mapStateToProps),
    injectIntl
)(LandingPageComponent);

export default LandingPage;

const fontcolor = {
    color: 'white',
};
