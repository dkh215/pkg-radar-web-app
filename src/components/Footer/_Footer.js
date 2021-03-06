import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import Typography from 'material-ui/Typography';
import ReactRotatingText from 'react-rotating-text';

class Footer extends Component {
  state = {
    searchExamples: ['machine learning', 'data science', 'serverless python', 'frontend javascript frameworks', 'aws']
  }

  render() {
    const styles = {
      containerOuter: {
        background: '#F7F7F7',
        position: 'fixed',
        bottom: 0,
        width: '100%'
      },
      containerInner: {
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '15px 20px',
      }
    }
    return (
      <footer style={styles.containerOuter}>
        <div style={styles.containerInner}>
          <div style={{ display: 'inline-block', width: '50%' }}>
            <ReactRotatingText 
              id='pr-search-examples' 
              items={this.state.searchExamples}
            />
          </div>
          {/* <Link className='no-underline black mr4' to='/'>About</Link>
          <Link className='no-underline black mr4' to='/'>Boards</Link> */}
          <div style={{ display: 'inline-block', width: '50%', textAlign: 'right' }}>
            <Typography
              type="subheading"
              style={{
                display: 'inline-block',
                marginRight: '10px',
                verticalAlign: 'middle'
              }}
            >
              Made in Philly by
            </Typography>
            <a
              href="https://twitter.com/danielkhunter"
              className="twitter-follow-button no-underline"
              target='_blank'
              rel="noopener noreferrer"
            >
              @danielkhunter
            </a>
          </div>
        </div>
      </footer>
    )
  }
}

export default Footer
