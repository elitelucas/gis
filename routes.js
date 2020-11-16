const requireSuper = require('./middlewares/requireSuper');
const requireSystem = require('./middlewares/requireSystem');
const requireAdmin = require('./middlewares/requireAdmin');
const requireAuth = require('./middlewares/requireAuth');
//***YYY */
const ctrlUser = require('./controllers/users');
const ctrlAdmin = require('./controllers/admin');
const ctrlFile = require('./file');
const ctrlCamera = require('./controllers/camera');
const ctrlSetting = require('./controllers/setting');

const router = require('express').Router();
//user
router.post('/login', ctrlUser.login);
router.post('/editPassword', ctrlUser.editPassword);
//@file_upload
router.post('/uploadAvatar',[requireAuth],ctrlFile.uploadAvatarItem);

//admin
router.post('/admin/getSystemUser',[requireAuth,requireSuper],ctrlAdmin.getSystemUser);
router.post('/admin/editSystemUser',[requireAuth,requireSuper],ctrlAdmin.editSystemUser);
router.post('/admin/delSystemUser',[requireAuth,requireSuper],ctrlAdmin.delSystemUser);
router.post('/admin/addSystemUser',[requireAuth,requireSuper],ctrlAdmin.addSystemUser);

router.post('/admin/getCompanyAll',[requireAuth,requireSystem],ctrlAdmin.getCompany);
router.post('/admin/editCompanyAll',[requireAuth,requireSystem],ctrlAdmin.editCompany);
router.post('/admin/delCompanyAll',[requireAuth,requireSystem],ctrlAdmin.delCompany);
router.post('/admin/addCompanyAll',[requireAuth,requireSystem],ctrlAdmin.addCompany);

router.post('/admin/getIndividual',[requireAuth,requireSystem],ctrlAdmin.getIndividual);
router.post('/admin/editIndividual',[requireAuth,requireSystem],ctrlAdmin.editIndividual);
router.post('/admin/delIndividual',[requireAuth,requireSystem],ctrlAdmin.delIndividual);
router.post('/admin/addIndividual',[requireAuth,requireSystem],ctrlAdmin.addIndividual);

router.post('/company/getCompanyAll',[requireAuth,requireAdmin],ctrlUser.getCompany);
router.post('/company/editCompanyAll',[requireAuth,requireAdmin],ctrlUser.editCompany);
router.post('/company/delCompanyAll',[requireAuth,requireAdmin],ctrlUser.delCompany);
router.post('/company/addCompanyAll',[requireAuth,requireAdmin],ctrlUser.addCompany);

router.post('/company/getIndividual',[requireAuth,requireAdmin],ctrlUser.getIndividual);
router.post('/company/editIndividual',[requireAuth,requireAdmin],ctrlUser.editIndividual);
router.post('/company/delIndividual',[requireAuth,requireAdmin],ctrlUser.delIndividual);
router.post('/company/addIndividual',[requireAuth,requireAdmin],ctrlUser.addIndividual);
//device
router.post('/admin/getCameraRegister',[requireAuth,requireSystem],ctrlCamera.getCameraRegister);
router.post('/admin/editCameraRegister',[requireAuth,requireSystem],ctrlCamera.editCameraRegister);
router.post('/admin/delCameraRegister',[requireAuth,requireSystem],ctrlCamera.delCameraRegister);
router.post('/admin/addCameraRegister',[requireAuth,requireSystem],ctrlCamera.addCameraRegister);

router.post('/admin/getCameraUserIndividual',[requireAuth,requireSystem],ctrlCamera.getCameraUserIndividualAll);
router.post('/admin/editCameraUserIndividual',[requireAuth,requireSystem],ctrlCamera.editCameraUserIndividualAll);
router.post('/admin/delCameraUserIndividual',[requireAuth,requireSystem],ctrlCamera.delCameraUserIndividualAll);
router.post('/admin/addCameraUserIndividual',[requireAuth,requireSystem],ctrlCamera.addCameraUserIndividualAll);

router.post('/admin/getCameraUserCompany',[requireAuth,requireSystem],ctrlCamera.getCameraUserCompanyAll);
router.post('/admin/editCameraUserCompany',[requireAuth,requireSystem],ctrlCamera.editCameraUserCompanyAll);
router.post('/admin/delCameraUserCompany',[requireAuth,requireSystem],ctrlCamera.delCameraUserCompanyAll);
router.post('/admin/addCameraUserCompany',[requireAuth,requireSystem],ctrlCamera.addCameraUserCompanyAll);

router.post('/company/getCameraUserIndividual',[requireAuth,requireAdmin],ctrlCamera.getCameraUserIndividual);
router.post('/company/editCameraUserIndividual',[requireAuth,requireAdmin],ctrlCamera.editCameraUserIndividual);
router.post('/company/delCameraUserIndividual',[requireAuth,requireAdmin],ctrlCamera.delCameraUserIndividual);
router.post('/company/addCameraUserIndividual',[requireAuth,requireAdmin],ctrlCamera.addCameraUserIndividual);
//landing page
router.post('/admin/updateSetting',[requireAuth,requireSuper],ctrlSetting.updateSetting);
router.post('/admin/getSetting',[requireAuth,requireSuper],ctrlSetting.getSetting);
router.post('/admin/settingUpload',[requireAuth,requireSuper],ctrlFile.uploadSetting);

module.exports = (app) => {
  app.use('/api', router);

  app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
  });

  app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
      message: error.message
    });
  });
};
