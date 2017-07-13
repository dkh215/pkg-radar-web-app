import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Button from 'material-ui/Button'
import { Link } from 'react-router-dom'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'
import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import { Add } from 'material-ui-icons'
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'
import { withRouter } from 'react-router-dom'
import Avatar from 'material-ui/Avatar'
import Menu, { MenuItem } from 'material-ui/Menu'
import SearchIcon from 'material-ui-icons/Search'

import Search from './_Search'

import CREATE_PACKAGE_MUTATION from '../../mutations/createPackage'


class Header extends Component {
  static defaultProps = {
    title: '<pkg> radar'
  }

  state = {
    isCreatePackageModalOpen: false,
    isCreatePackageURLValid: false,
    createPackageURL: '',
    isUserMenuOpen: false,
    isCreatePackageLoading: false
  }

  _handleUserMenuClick = (event) => {
    this.setState({
      isUserMenuOpen: true,
      userMenuAnchorEl: event.currentTarget
    })
  };

  _handleUserMenuClose = () => {
    this.setState({ isUserMenuOpen: false });
  }

   _login = () => {
    this.props.auth.show()
  }

  _logout = () => {
    this.setState({ isUserMenuOpen: false }, () => {
      setTimeout(() => {
        // remove token from local storage and reload page to reset apollo client
        window.localStorage.removeItem('auth0IdToken')
        window.location.replace('/')
      }, 500)
    })
  }

  _handleModalOpen = () => {
    this.setState({ isCreatePackageModalOpen: true })
  }

  _handleModalClose = () => {
    this.setState({ isCreatePackageModalOpen: false })
  }

  _handlePackageURLChange = (url) => {
    this.setState({ createPackageURL: url })

    if (url.includes('https://github.com')) {
      this.setState({ isCreatePackageURLValid: true })
    } else {
      this.setState({ isCreatePackageURLValid: false })
    }
  }

  _handleCreatePackage = async () => {
    console.log('creating package', this.state.createPackageURL)
    this.setState({ isCreatePackageLoading: true })

    try {
      const pkg = await this.props.createPackage({ 
        variables: {
          repoUrl: this.state.createPackageURL,
          createdBy: this.props.user.id
        }
      })

      this.setState({ 
        isCreatePackageModalOpen: false, 
        isCreatePackageLoading: false 
      })

      const name = pkg.data.createPackage.name

      if (name) {
        console.info('pkg created', name)
        this.props.history.replace(`/package/${name}`)
      } else {
        console.error('pkg name is undefined')
      }
    } catch(e) {
      this.setState({ 
        isCreatePackageModalOpen: false,
        isCreatePackageLoading: false 
      })
      console.error(e)
    }
  }

  render() {
    const { history, title, user } = this.props

     return (
       <div>
          <AppBar
            id="Header"
            position="static"
            color='primary'
          >
            <Toolbar
              style={{
                padding: '0 16px',
                height: '56px',
                width: '100%',
                maxWidth: '1600px',
                margin: '0 auto'
              }}
            >
              <Grid container align='center' gutter={16}>
                <Grid item xs={3}>
                  <Typography type="title" component='h1'>
                    <Link
                      to="/"
                      className='no-underline white'
                    >
                      {title}
                    </Link>
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={7}
                  style={{
                    borderRadius: '2px',
                    height: '36px',
                    backgroundColor: 'rgba(255,255,255,.15)',
                    color: '#fff',
                    padding: '0'
                  }}
                >
                  {
                    user &&
                    <div>
                      <SearchIcon style={{ position: 'absolute', margin: '0 10px 0 15px', top: '18px' }} />
                      <Search history={history}/>
                    </div>
                  }
                </Grid>
                <Grid item xs={2}>
                  <div className='tr'>
                   {
                     !user &&
                     <div>
                      <Button
                         raised
                         color="default"
                         onTouchTap={() => this._login()}
                       >
                        <i className='fa fa-lg fa-github mr2' />
                         Sign In
                      </Button>
                     </div>
                   }
                   {
                     user &&
                     <div>
                       <IconButton
                         onTouchTap={this._handleModalOpen}
                         className='v-mid'
                       >
                         <Add style={{ color: 'white' }} />
                       </IconButton>
                       <Avatar
                         src={user.avatar}
                         alt="User Image"
                         style={{
                           display: 'inline-block',
                           verticalAlign: 'middle',
                           border: '1px solid white',
                           cursor: 'pointer',
                           borderRadius: 0
                         }}
                         onClick={this._handleUserMenuClick}
                       />
                       <Menu
                         id="simple-menu"
                         anchorEl={this.state.userMenuAnchorEl}
                         open={this.state.isUserMenuOpen}
                         onRequestClose={this._handleUserMenuClose}
                         style={{ marginTop: '40px', width: '150px' }}
                       >
                         <MenuItem
                           onClick={this._handleUserMenuClose}
                         >
                           <Link
                             to={`/profile/${user.username}`}
                             className='no-underline fw4'
                             style={{ color: 'rgba(0, 0, 0, 0.87)' }}
                           >
                             Profile
                          </Link>
                         </MenuItem>
                         <MenuItem onClick={this._handleUserMenuClose}>
                           <Link
                             to={`/settings`}
                             className='no-underline fw4'
                             style={{ color: 'rgba(0, 0, 0, 0.87)' }}
                           >
                             Settings
                          </Link>
                         </MenuItem>
                         <MenuItem onClick={() => this._logout()}>Logout</MenuItem>
                       </Menu>
                     </div>
                   }
                  </div>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>

          <Dialog
            open={this.state.isCreatePackageModalOpen}
            onRequestClose={this._handleModalClose}
          >
           <DialogTitle>Add New Package</DialogTitle>
           <DialogContent style={{ width: '500px' }}>
             <DialogContentText style={{ marginBottom: '10px' }}>
               Enter a valid Github Repo url below:
             </DialogContentText>
             <TextField
               autoFocus
               value={this.state.createPackageURL}
               style={{ width: '100%' }}
               onChange={(e) => this._handlePackageURLChange(e.target.value)}
               InputProps={{ placeholder: 'https://github.com/facebook/react' }}
             />
           </DialogContent>
           <DialogActions>
             <Button
               className='mr3'
               onTouchTap={this._handleModalClose}
             >
               Cancel
            </Button>
             <Button
               raised
               color="primary"
               disabled={!this.state.isCreatePackageURLValid}
               onTouchTap={this._handleCreatePackage}
             >
               Submit
            </Button>
           </DialogActions>
         </Dialog>
        </div>
     )
  }
}

export default graphql(CREATE_PACKAGE_MUTATION, { name: 'createPackage' })(
  withRouter(Header)
)
