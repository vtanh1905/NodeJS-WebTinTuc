//Chinh Do Cao Cua Content
$("#content").css("height", $(window).height() - $("#nav-left").height());
$(window).on("resize", function () {

  $("#content").css("height", $(window).height() - $("#nav-left").height());
});

//Sự Kiện Upload Hình Ảnh Tiêu Đề
function performClick(elemId) {
  var elem = document.getElementById(elemId);
  if (elem && document.createEvent) {
    var evt = document.createEvent("MouseEvents");
    evt.initEvent("click", true, false);
    elem.dispatchEvent(evt);
  }
}

//Thiết Lập Editor
function settingEditor(isReadOnly) {
  ClassicEditor
    .create(document.querySelector('#editor'), {
      // toolbar: [ 'heading', '|', 'bold', 'italic', 'link' ]
    })
    .then(editor => {
      window.editor = editor;
      editor.isReadOnly = isReadOnly;
    })
    .catch(err => {
      console.error(err.stack);
    });
}

// Event Remove Tag
function removeElement(e) {
  var e = event || window.event;
  $(e.target).remove();
}
// Event Add Tag
function eventAddTag(selectorButton, selectorTXT, selectorTagGroup) {
  $(selectorButton).click(function () {
    var textTag = $(selectorTXT).val();
    if (textTag.length == 0) {
      return;
    }
    $(selectorTagGroup).append(
      '<input type="text" name="ListTagName" style="cursor: pointer;" class="btn btn-primary btn-sm d-inline-block mt-1 text-white" onclick="removeElement()" value="'+ textTag +'">');
    $("#txtTag").val("");
  });
}

//Event Select Box Vai Tro
function eventSelectVaiTro() {
  $("#boxChuyenMuc").hide();
  $("#sltVaiTro").change(function () {
    if ($(this).val() == "0") {
      $("#boxNgayHetHan").show();
      $("#boxChuyenMuc").hide();
    } else if ($(this).val() == "2") {
      $("#boxNgayHetHan").hide();
      $("#boxChuyenMuc").show();
    } else {
      $("#boxNgayHetHan").hide();
      $("#boxChuyenMuc").hide();
    }
  });
}

// get current day
var getCurrentDay = function (sp) {
  today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //As January is 0.
  var yyyy = today.getFullYear();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  return (dd + sp + mm + sp + yyyy);
};

// get current Time
var getCurrentTime = function (sp) {
  var today = new Date();
  var time = today.getHours() + sp + today.getMinutes();
  return time;
};

//check Time
function CheckTime24(time) {
  var re = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/;
  return re.test(time);
}

//check Date
function CheckDate(date) {
  var re = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
  return re.test(date);
}

//Event Module Duyet Bai Viet
function moduleDuyetBaiViet() {
  //Xet Date vs Time Xuat Bản
  $("#txtTGXuatBan").attr('readonly', true);

  $("#rdLapTuc").click(function () {
    $("#txtTGXuatBan").attr('readonly', true);
  });

  $("#rdCho").click(function () {
    $("#txtTGXuatBan").attr('readonly', false);
  });

  $("#formDangBai").submit(function () {
    var valNgayDang = $("#txtNgayDang").val();
    var valGioDang = $("#txtGioDang").val();
    if (!CheckTime24(valGioDang)) {
      alert("Vui lòng nhập đúng định dạng thời gian!");
      return false;
    }

    if (!CheckDate(valNgayDang)) {
      alert("Vui lòng nhập đúng định dạng ngày sinh!");
      return false;
    }
  });
}