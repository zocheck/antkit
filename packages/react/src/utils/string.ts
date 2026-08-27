/* oxlint-disable no-useless-escape */
export const slugify = (alias?: string) => {
  if (!alias) return alias;
  let slug = alias.toLowerCase();
  // Đổi ký tự có dấu thành không dấu
  slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
  slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
  slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
  slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
  slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
  slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
  slug = slug.replace(/đ/gi, 'd');
  // Xóa các ký tự đặt biệt
  slug = slug.replace(
    /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
    '',
  );
  // Đổi khoảng trắng thành ký tự gạch ngang
  slug = slug.replace(/ /gi, '-');
  // Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
  // Phòng trường hợp người nhập vào quá nhiều ký tự trắng
  slug = slug.replace(/\-\-\-\-\-/gi, '-');
  slug = slug.replace(/\-\-\-\-/gi, '-');
  slug = slug.replace(/\-\-\-/gi, '-');
  slug = slug.replace(/\-\-/gi, '-');
  // Xóa các ký tự gạch ngang ở đầu và cuối
  slug = '@' + slug + '@';
  slug = slug.replace(/\@\-|\-\@|\@/gi, '');

  return slug;
};

export const formatterNparserCurrency: {
  formatter: (value?: string | number | null) => string;
  parser: (value?: string) => string;
} = {
  formatter: (value) => `đ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
  parser: (value) => (value ? value.replace(/\đ\s?|(,*)/g, '') : ''),
};

export const parseYoutubeIdFromUrl = (url: string) => {
  const regexYoutubeUrl = new RegExp(
    /(https?:\/\/)?(www\.)?(youtu\.be\/|youtube(?:-nocookie)?\.com\/(embed\/|v\/|watch\?(.+&)*v=))(?<videoId>(\w|-){11})/gim,
  );
  const execValue = regexYoutubeUrl.exec(url);
  regexYoutubeUrl.lastIndex = 0;
  return execValue?.groups?.videoId;
};
