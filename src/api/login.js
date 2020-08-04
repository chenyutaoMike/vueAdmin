import service from '@/utils/request';
/**
 * 获取验证码
 */

export function GetSms(data) {

  return service.request({
    method: 'post',
    url: '/getSms/',
    data: data
  })
}
/**
 * 获取用户角色
 */
export function GetUserRole(data={}) {

  return service.request({
    method: 'post',
    url: '/userRole/',
    data: data
  })
}

/**
 * 登陆
 */
export function Login(data){
  return service.request({
    method: 'post',
    url: '/login/',
    data: data
  })
}

/**
 * 退出登陆
 */
export function Logout(data={}){
  return service.request({
    method: 'post',
    url: '/logout/',
    data: data
  })
}


/**
 * 注册
 */
export function Register(data) {
  return service.request({
    method: 'post',
    url: '/register/',
    data: data
  })
}