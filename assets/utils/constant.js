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
  CHANNEL: 'Kênh',
  CLOSE: 'Đóng',
  CATEGORY: 'Thể loại',
  DESCRIPTION: 'Chi tiết',
  SEARCH: 'Tìm kiếm',
  START_TIME: 'Thời gian bắt đầu',
  START: 'Bắt đầu',
  END: 'Kết thúc',
  END_TIME: 'Thời gian kết thúc',
  TIME: 'Thời gian',
  PROGRAM_NAME: 'Tên chương trình',
  PROGRAM_DETAIL: 'Chi tiết chương trình',
  PROGRAM: 'Chương trình',
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
  TODAY: 'Hôm nay',
  VIP_TODAY_PROGRAM: 'Chương trình nổi bật hôm nay',
  ON_BROADCASTING_PROGRAMS: 'Chương trình đang chiếu',
  TODAY_PROGRAM: 'Chương trình hôm nay',
  NEXT_THREE_DAY_PROGRAM: 'Chương trình trong 3 ngày tới',
  NEXT_DAY: 'Ngày mai',
  NEXT_DAY_PROGRAM: 'Chương trình ngày mai',
  HIDE: 'Ẩn',
  SHOW: 'Hiện',
  UPLOAD: 'Tải lên',
  SUBMIT: 'Xác nhận',
  CANCEL: 'Hủy bỏ',
  SELECT: 'Chọn',
  SELECT_CATEGORY: 'Chọn thể loại',
  SELECT_CHANNEL: 'Chọn kênh',
  INPUT_PROGRAM_NAME: 'Nhập tên chương trình',
  VIP_INCOMING_PROGRAM: 'Chương trình sắp chiếu hôm nay',
  VIP_TOMORROW_PROGRAM: 'Chương trình nổi bật ngày mai',
  SHOW_ON_HOMEPAGE: 'Hiển thị trên trang chủ',
  NO_MORE_THAN_TWO: 'Không chọn nhiều hơn 2 thể loại',
  VIP_CHANNEL_MAX_NUM: 8,
  TODAY_VIP_PROGRAM_MAX_NUM: 8,
  NEXT_DAY_VIP_PROGRAM_MAX_NUM: 8,
  NEXT_DAYS_SHOW_NUM: 3,
  PAGE_TITLE: 'Truyền hình 24h',
  PROGRAM_SCHEDULE_NEXT_DAYS: 'Lịch phát sóng thời gian tới',
  CLEAR_SEARCH: 'Hủy tìm kiếm',
  PROGRAM_LIST: 'Danh sách chương trình',
  ALL_CHANNEL: 'Tất cả kênh',
  ALL: 'Tất cả',
  SEARCH_PROGRAM: 'Tìm kiếm chương trình',
  TOTAL: 'Tổng số',
  SEARCH_CHANNEL_PROGRAM: 'Tìm kiếm các kênh, chương trình,...',
  TYPE_2_CHAR_AT_LEAST: 'Nhập tối thiểu 2 kí tự',
  RANK: 'Đánh giá',
  INTRODUCTION: 'Giới thiệu',
  NO_DATA: 'Không có dữ liệu!!!',
  ADD_TO_GOOGLE_CAL: 'Thêm vào Google Calendar'
}
import { firebase } from '@/MyFireBase'
export const FB = {
  channelRef: firebase.firestore().collection('channels'),
  scheduleRef: firebase.firestore().collection('schedules'),
  programRef: firebase.firestore().collection('programs'),
  timestamp: firebase.firestore.Timestamp
}

export const programRankOptions = [
  { label: 'Đặc biệt', value: 3, text: 'Đặc biệt' },
  { label: 'Tốt', value: 2, text: 'Tốt' },
  { label: 'Bình thường', value: 1, text: 'Bình thường' }
]

export const programRankMap = new Map([
  [1, 'Bình thường'],
  [2, 'Tốt'],
  [3, 'Đặc biệt']
])

export const categoryMap = new Map([
  [1, 'Phim'],
  [2, 'Game show'],
  [3, 'Thực tế'],
  [4, 'Trực tiếp'],
  [5, 'Phóng sự'],
  [6, 'Tin tức'],
  [7, 'Khoa học'],
  [8, 'Tài liệu'],
  [9, 'Khám phá'],
  [10, 'Ca nhạc'],
  [11, 'Kinh dị'],
  [12, 'Hài hước'],
  [13, 'Hành động'],
  [14, 'Viễn tưởng'],
  [15, 'Thần thoại'],
  [16, 'Hình sự'],
  [17, 'Phiên lưu'],
  [18, 'Cổ trang'],
  [19, 'Chiến tranh'],
  [20, 'Hoạt hình'],
  [21, 'Tình cảm'],
  [22, 'Tâm lý']
])

export const categoryTagMap = new Map([
  [1, 'primary'], // 'Phim',
  [2, 'primary'], // 'Game show',
  [3, 'primary'], // 'Thực tế',
  [4, 'primary'], // 'Trực tiếp',
  [5, 'info'], // 'Phóng sự',
  [6, 'info'], // 'Tin tức',
  [7, 'info'], // 'Khoa học',
  [8, 'info'], // 'Tài liệu',
  [9, 'primary'], // 'Khám phá',
  [10, 'primary'], // 'Ca nhạc',
  [11, 'danger'], // 'Kinh dị',
  [12, 'success'], // 'Hài hước',
  [13, 'danger'], // 'Hành động',
  [14, 'warning'], // 'Viễn tưởng',
  [15, 'warning'], // 'Thần thoại',
  [16, 'danger'], // 'Hình sự',
  [17, 'success'], // 'Phiên lưu',
  [18, 'warning'], // 'Cổ trang',
  [19, 'danger'], // 'Chiến tranh',
  [20, 'warning'], // 'Hoạt hình',
  [21, 'success'], // 'Tình cảm',
  [22, 'success'] // 'Tâm lý',
])

export const CATEGORIES = [
  { value: 1, label: 'Phim', text: 'Phim' },
  { value: 2, label: 'Game show', text: 'Game show' },
  { value: 3, label: 'Thực tế', text: 'Thực tế' },
  { value: 4, label: 'Trực tiếp', text: 'Trực tiếp' },
  { value: 5, label: 'Phóng sự', text: 'Phóng sự' },
  { value: 6, label: 'Tin tức', text: 'Tin tức' },
  { value: 7, label: 'Khoa học', text: 'Khoa học' },
  { value: 8, label: 'Tài liệu', text: 'Tài liệu' },
  { value: 9, label: 'Khám phá', text: 'Khám phá' },
  { value: 10, label: 'Ca nhạc', text: 'Ca nhạc' },
  { value: 11, label: 'Kinh dị', text: 'Kinh dị' },
  { value: 12, label: 'Hài hước', text: 'Hài hước' },
  { value: 13, label: 'Hành động', text: 'Hành động' },
  { value: 14, label: 'Viễn tưởng', text: 'Viễn tưởng' },
  { value: 15, label: 'Thần thoại', text: 'Thần thoại' },
  { value: 16, label: 'Hình sự', text: 'Hình sự' },
  { value: 17, label: 'Phiên lưu', text: 'Phiên lưu' },
  { value: 18, label: 'Cổ trang', text: 'Cổ trang' },
  { value: 19, label: 'Chiến tranh', text: 'Chiến tranh' },
  { value: 20, label: 'Hoạt hình', text: 'Hoạt hình' },
  { value: 21, label: 'Tình cảm', text: 'Tình cảm' },
  { value: 22, label: 'Tâm lý', text: 'Tâm lý' }
].sort((a, b) => {
  if (a.label > b.label) {
    return 1
  } else if (a.label < b.label) {
    return -1
  } else {
    return 0
  }
})
