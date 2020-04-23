export const COMMON = {
  DATE: 'ngày',
  MONTH: 'tháng',
  YEAR: 'năm',
  AT: 'lúc',
  ON: 'vào',
  PRIMARY_COLOR: '#1890ff',
  SUCCESS_COLOR: '#13ce66',
  WARNING_COLOR: '#FFBA00',
  DANGER_COLOR: '#ff4949',
  INFO_COLOR: '#909399',
  MONDAY: 'Thứ hai',
  TUESDAY: 'Thứ ba',
  WEDNESDAY: 'Thứ tư',
  THURSDAY: 'Thứ năm',
  FRIDAY: 'Thứ sáu',
  SATURDAY: 'Thứ bảy',
  SUNDAY: 'Chủ nhật',
  HOMEPAGE: 'Trang chủ',
  CHANNEL_LIST: 'Danh sách kênh',
  CLOSE: 'Đóng',
  CATEGORY: 'Thể loại',
  DESCRIPTION: 'Chi tiết',
  SEARCH: 'Tìm kiếm',
  START_TIME: 'Thời gian bắt đầu',
  TIME: 'Thời gian',
  PROGRAM_NAME: 'Tên chương trình',
  PROGRAM_DETAIL: 'Chi tiết chương trình',
  NAME: 'Tên',
  EDIT: 'Sửa',
  SCHEDULE: 'Lịch phát sóng',
  DELETE: 'Xóa',
  CREATE_CHANNEL: 'Tạo kênh mới',
  ACTION: 'Thao tác',
  DASHBOARD: 'Trang quản lý',
  LOG_OUT: 'Đăng xuất',
  VIP_CHANNEL_DESCRIPTION: 'Kênh VIP sẽ được xuất hiện trên trang chủ.',
  VIP_CHANNEL: 'Kênh nổi bật',
  VIP_TODAY_PROGRAM: 'Chương trình nổi bật hôm nay',
  TODAY_PROGRAM: 'Chương trình hôm nay',
  HIDE: 'Ẩn',
  SHOW: 'Hiện'

}
import { firebase } from '@/FireBase'
export const FB = {
  channelRef: firebase.firestore().collection('channels'),
  scheduleRef: firebase.firestore().collection('schedules'),
  programRef: firebase.firestore().collection('programs')
}

export const categoryMap = new Map([
  [1, 'Phim truyện'],
  [2, 'Game show truyền hình'],
  [3, 'Chương trình thực tế'],
  [4, 'Chương trình trực tiếp'],
  [5, 'Phóng sự - tài liệu'],
  [6, 'Thời sự - Tin tức'],
  [7, 'Khoa học - Khám phá']
])

export const CATEGORIES = [
  { value: 1, label: 'Phim truyện' },
  { value: 2, label: 'Game show truyền hình' },
  { value: 3, label: 'Chương trình thực tế' },
  { value: 4, label: 'Chương trình trực tiếp' },
  { value: 5, label: 'Phóng sự - tài liệu' },
  { value: 6, label: 'Tin tức' },
  { value: 7, label: 'Khoa học' }
]