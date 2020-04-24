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
  NEXT_THREE_DAY_PROGRAM: 'Chương trình trong 3 ngày tới',
  HIDE: 'Ẩn',
  SHOW: 'Hiện',
  UPLOAD: 'Tải lên',
  SUBMIT: 'Xác nhận',
  CANCEL: 'Hủy bỏ',
  SELECT: 'Chọn',
  VIP_INCOMING_PROGRAM: 'Chương trình nổi bật sắp chiếu'

}
import { firebase } from '@/MyFireBase'
export const FB = {
  channelRef: firebase.firestore().collection('channels'),
  scheduleRef: firebase.firestore().collection('schedules'),
  programRef: firebase.firestore().collection('programs')
}

export const categoryMap = new Map([
  [1, 'Phim truyện'],
  [2, 'Game show'],
  [3, 'Thực tế'],
  [4, 'Trực tiếp'],
  [5, 'Phóng sự'],
  [6, 'Tin tức'],
  [7, 'Khoa học'],
  [8, 'Tài liệu'],
  [9, 'Khám phá'],
  [10, 'Ca nhạc']
])

export const CATEGORIES = [
  { value: 1, label: 'Phim truyện' },
  { value: 2, label: 'Game show' },
  { value: 3, label: 'Thực tế' },
  { value: 4, label: 'Trực tiếp' },
  { value: 5, label: 'Phóng sự' },
  { value: 6, label: 'Tin tức' },
  { value: 7, label: 'Khoa học' },
  { value: 8, label: 'Tài liệu' },
  { value: 9, label: 'Khám phá' },
  { value: 10, label: 'Ca nhạc' }
]
