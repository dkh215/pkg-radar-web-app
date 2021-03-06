import React, { Component } from 'react'

import Grid from "material-ui/Grid"
import Paper from 'material-ui/Paper'
import Hidden from 'material-ui/Hidden';
// import Typography from 'material-ui/Typography';
// import Divider from 'material-ui/Divider';

import { PackageCard } from '../Packages'
import { SearchMain } from '../Shared'
import { Footer } from '../Footer'

import reactImgSrc from '../../images/facebook.png';
import djangoImgSrc from '../../images/django.png';
import kerasImgSrc from '../../images/keras.png';
import electronImgSrc from '../../images/electron.png';

class Home extends Component {
  static defaultProps = {
    title: '<pkg> radar',
    featuredPackages: [
      {
        avatar: reactImgSrc,
        color: '#f1e05a',
        issues: 4601,
        language: 'JavaScript',
        ownerName: 'facebook',
        packageName: 'react',
        stars: 70546
      },
      {
        avatar: djangoImgSrc,
        color: '#3572A5',
        issues: 0,
        language: 'Python',
        ownerName: 'django',
        packageName: 'django',
        stars: 27287
      },
      {
        avatar: kerasImgSrc,
        color: '#3572A5',
        issues: 5439,
        language: 'Python',
        ownerName: 'fchollet',
        packageName: 'keras',
        stars: 18339
      },
      {
        avatar: electronImgSrc,
        color: '#f1e05a',
        issues: 6786,
        language: 'JavaScript',
        ownerName: 'electron',
        packageName: 'electron',
        stars: 48834
      }
    ]
  }

  _renderFeaturedPackages() {
    return this.props.featuredPackages.map(pkg => {
      return (
        <Grid 
          item 
          xs={12}
          sm={6}
          md={3}
          key={pkg.packageName}
        >
          <PackageCard
            avatar={pkg.avatar}
            color={pkg.color}
            issues={pkg.issues}
            language={pkg.language}
            ownerName={pkg.ownerName}
            packageName={pkg.packageName}
            stars={pkg.stars}
          />
      </Grid>
      )
    })
  }

  render() {
    const { title } = this.props

    return (
      <Grid
        container
        align="center"
        justify="center"
        direction="row"
        id='Home'
        style={{ height: '100%' }}
      >
        <Grid
          item
          md={6}
          xs={12}
          style={{ maxWidth: '585px', marginBottom: '10px' }}
        >
          <Hidden smDown>
            <h2
              style={{
                textAlign: 'center',
                fontSize: '60px',
                color: '#263238',
                marginBottom: '20px',
              }}
            >
              {title}
            </h2>
          </Hidden>
          <Paper elevation={4} style={{ padding: '10px 0' }}>
            <SearchMain autoFocus />
          </Paper>
          <p
            style={{
              position: 'relative',
              zIndex: -2,
              textAlign: 'center',
              fontWeight: '300'
            }}
          >
            Search and Discover. Evaluate and Save.
          </p>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            {this._renderFeaturedPackages()}
          </Grid>
        </Grid>
        <Hidden smDown>
          <Footer />
        </Hidden>
      </Grid>
    );
  }
}

export default Home
