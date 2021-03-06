import React, { Component } from "react";
import Card, { CardHeader, CardContent, CardActions } from "material-ui/Card";
import Button from "material-ui/Button";
import { Link } from "react-router-dom";
import Icon from 'material-ui/Icon';
import Humanize from "humanize-plus";
import Typography from "material-ui/Typography";

class PackageCard extends Component {
  render() {
    const { 
      avatar, 
      color,
      description,
      issues, 
      language, 
      ownerName, 
      packageName, 
      stars 
    } = this.props

    const styles = {
      root: {
        // boxShadow: "5px 5px 25px 0px rgba(46,61,73,0.2)"
      },
      header: {
        paddingBottom: '0'
      },
      content: {
        padding: '10px 16px 0'
      }
    };

    return (
      <Card style={styles.root}>
        <CardHeader
          style={styles.header}
          avatar={
            <img
              alt={`${packageName}-logo`}
              style={{ height: "42px" }}
              src={avatar}
            />
          }
          title={
            <span style={{ fontSize: '20px' }}>
              {packageName}
            </span>
          }
          subheader={
            <div>
              <div
                style={{
                  display: "inline-block",
                  width: "15px",
                  height: "15px",
                  marginRight: "5px",
                  borderRadius: "50%",
                  verticalAlign: "sub",
                  backgroundColor: `${color}`
                }}
              />
              <span>{language}</span>
            </div>
          }
        />
        <CardContent style={styles.content}>
          <div className="mb1 mr2 dib">
            <Icon
              style={{
                verticalAlign: "sub",
                height: "18px",
                width: "18px",
                marginRight: "10px"
              }}
            >
              stars
            </Icon>
            <span style={{ verticalAlign: 'text-top' }}>{Humanize.formatNumber(stars)}</span>
          </div>
          <div className="dib">
            <Icon
              style={{
                verticalAlign: "sub",
                height: "18px",
                width: "18px",
                marginRight: "10px"
              }}
            >
              error_outline
            </Icon>
            <span style={{ verticalAlign: 'text-top' }}>{Humanize.formatNumber(issues)}</span>
          </div>
          {
            description &&
            <Typography type="body1" gutterBottom style={{ marginTop: '10px' }}>
              {description}
            </Typography>
          }
        </CardContent>
        <CardActions>
          <Link className="no-underline" to={`/${ownerName}/${packageName}`}>
            <Button dense>View Package</Button>
          </Link>
        </CardActions>
      </Card>
    );
  }
}

export default PackageCard;
