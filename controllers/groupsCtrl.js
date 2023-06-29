const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const axios = require('axios')

const groups = asyncHandler(async(req, res) => {
  const findGroups = await User.findById({_id: req.cookies._id})
  const groups = []

  findGroups.accountsFb.forEach(account => {
    const accounts = []

    const foundAccount = accounts.find(a => a.id === account.id_account);
  
    if (foundAccount) {
      findGroups.groups.forEach(group => {
        if (group.id_account === account.id_account) {
          foundAccount.groups.push(group);
        }
      });
    } else {
      const newAccount = {
        id: account.id_account,
        name: account.name,
        photo: account.photo,
        groups: []
      };
  
      findGroups.groups.forEach(group => {
        if (group.id_account === account.id_account) {
          newAccount.groups.push(group);
        }
      });
  
      accounts.push(newAccount);
    }

    groups.push(accounts);
  });

  res.render('layouts/groups', { isAdmin: findGroups.isAdmin, groups: findGroups.groups, notifications: findGroups.notifications.reverse().slice(0, 5), photo: findGroups.photo, accounts: findGroups.accountsFb, name_user: findGroups.name })
})

const importGroups = asyncHandler(async (req, res) => {
  const id_account = req.params.id_account;
  const user = await User.findById(req.cookies._id);
  const account = user.accountsFb.find((account) => account.id_account == id_account);
  const accessToken = account.access_token;
  
  try {
    const response = await axios.get(`https://graph.facebook.com/v16.0/me/groups?access_token=${accessToken}&fields=privacy,name,icon,description,id`);
    const groups = response.data.data;
    const groupIds = groups.map((group) => group.id);
  
    const existingGroups = user.groups || [];
    
    existingGroups.forEach((group) => {
      if (group.id_account == account.id_account) existingGroups.pop(group)
    })
  
    const groupRequests = groups.map((group) => {
      return axios
        .get(
          `https://graph.facebook.com/v16.0/${group.id}?fields=name,description,cover&access_token=${accessToken}`
        )
        .then((response) => {
          return axios
            .get(
              `https://graph.facebook.com/v16.0/${group.id}?fields=events&access_token=${accessToken}`
            )
            .then((appInstalledResponse) => {
              const appInstalled = appInstalledResponse.status === 200;
    
              if (response.data.hasOwnProperty("cover")) {
                return {
                  name: response.data.name,
                  description: response.data.description,
                  image: response.data.cover.source,
                  id: response.data.id,
                  account_name: account.name,
                  id_account: account.id_account,
                  account_photo: account.photo,
                  appInstalled: appInstalled,
                };
              } else {
                return {
                  name: response.data.name,
                  id: response.data.id,
                  account_name: account.name,
                  id_account: account.id_account,
                  account_photo: account.photo,
                  appInstalled: appInstalled,
                };
              }
            })
            .catch((error) => {
              if (response.data.hasOwnProperty("cover")) {
                return {
                  name: response.data.name,
                  description: response.data.description,
                  image: response.data.cover.source,
                  id: response.data.id,
                  account_name: account.name,
                  id_account: account.id_account,
                  account_photo: account.photo,
                  appInstalled: false,
                };
              } else {
                return {
                  name: response.data.name,
                  id: response.data.id,
                  account_name: account.name,
                  id_account: account.id_account,
                  account_photo: account.photo,
                  appInstalled: false,
                };
              }
            });
        })
        .catch((error) => {
          return null;
        });
    });
  
    const results = await Promise.all(groupRequests);
    const validGroups = results.reduce((filteredGroups, group) => {
      if (group && !existingGroups.some((existingGroup) => existingGroup.id === group.id)) {
        filteredGroups.push(group);
      }
      return filteredGroups;
    }, []);
  
    const updatedGroups = existingGroups.concat(validGroups);

    await User.findByIdAndUpdate(req.cookies._id, {
      groups: updatedGroups.map((group) => ({
        name: group.name,
        id: group.id,
        image: group.hasOwnProperty("image") ? group.image : "",
        description: group.description,
        account_name: group.account_name,
        id_account: group.id_account,
        account_photo: group.account_photo,
        appInstalled: group.appInstalled
      })),
    }, { upsert: true });

    User.findOneAndUpdate({ _id: req.cookies._id, "accountsFb.id_account": id_account }, {
      $set: {
        "accountsFb.$.groups_length": updatedGroups.length
      }
    }, {
      new: true
    })
    .then(result => {
      res.sendStatus(200)
    })
    .catch(error => {
      res.sendStatus(500)
    });
  
  } catch (error) {
    res.sendStatus(500)
  }
});

module.exports = 
{   groups,
    importGroups
}