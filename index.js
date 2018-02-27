const fs = require('fs-extra')
const path = require('path')

let src = [] // исходных папок может быть несолько
let additionalSrcCount = 0 // счетчик добавленных полей выбора исходной папки
let dest = '' // путь к папке, в которую будут скопированы файлы

// преобразует содержимое текстэрии с номерами в массив,
// удаляет лишние пробелы и нули в номерах
const numbersToArr = (str) => {
  return str.split('\n').filter(item => item !== '').map(item => item.trim()).map(item => String(Number(item)))
}

// возвращает имя файла по номеру
const nameBuild = (num) => {
  switch (num.length) {
    case 1:
      num = '0000' + num
      break
    case 2:
      num = '000' + num
      break
    case 3:
      num = '00' + num
      break
    case 4:
      num = '0' + num
      break
    default:
      swal({
        type: 'error',
        title: 'Ошибка',
        text: `Некорректный номер фотографии: ${num}`
      })
  }

  return `DSC${num}.JPG`
}

let filesCounter = 0 // счётчик обработанных файлов из списка
let report = '' // финальный отчёт о копировании

// проверка доступа и корректности путей
const main = (fileNames) => {
  fs.access(src, fs.constants.R_OK, (err) => {
    if (err) {
      swal({
        type: 'error',
        title: 'Ошибка',
        text: 'Невозможно прочитать исходные фотографии'
      })
    } else {
      fs.access(dest, fs.constants.W_OK, (err) => {
        if (err) {
          swal({
            type: 'error',
            title: 'Ошибка',
            text: 'Невозможно записать фотографии'
          })
        } else {
          // копирование файлов по очереди
          fileNames.forEach((fileName, index, array) => {
            fs.access(path.join(src, fileName), fs.constants.R_OK, (err) => {
              if (err) {
                report += `❌ ${fileName}: не найден <br>`
                finalReport()
              } else {
                fs.copy(path.join(src, fileName), path.join(dest, fileName), (err) => {
                  if (err) {
                    throw err
                  } else {
                    report += `✅ ${fileName}<br>`
                    finalReport()
                  }
                })
              }
            })

            function finalReport() {
              filesCounter++
              if (filesCounter === array.length) {
                $.magnificPopup.open({
                  items: {
                    src: `<div class="white-popup">${report}</div>`,
                    type: 'inline'
                  }
                }, 0)
                // обнуление счетчика файлов и отчёта, чтобы можно было копировать другой набор файлов
                filesCounter = 0
                report = ''
              }
            }
          })
        }
      })
    }
  })
}

// запись адресов папок исходных папок
$('.input-src').on('change', function(e) {
  let srcInput = $(this).data('src') // порядковый номер инпута
  // запись названия папки в текстовый инпут
  $(`.src-select-${srcInput} .input-src-name`)[0].value = e.target.files[0].name
  let newSrcPath = e.target.files[0].path
  src[srcInput] = (newSrcPath)

  console.log(src);
})

// добавление блока выбора исходной папки
$('.js-add-src-btn').on('click', function() {
  console.log('todo: реализовать добавление инпута');
})

// удаление блока выбора исходной папки
$('.js-remove-src-btn').on('click', function() {
  console.log('todo: реализовать удаление инпута');
})

// запись адреса папки назначения
document.querySelector('#input-dest').onchange = function(e) {
  document.querySelector('#input-dest-name').value = e.target.files[0].name
  dest = e.target.files[0].path
}

// запуск программы по нажатию на кнопку Copy
document.querySelector('.submit').onclick = function(e) {
  e.preventDefault()
  let numbersStr = document.querySelector('#photonumbers').value
  // преобразуем строку с номерами в массив
  let numbersArr = numbersToArr(numbersStr)
  // массив номеров - в массив названий файлов
  let fileNames = numbersArr.map(num => nameBuild(num)).sort()

  if (!src.length || !dest) {
    swal({
      type: 'error',
      title: 'Ошибка',
      text: 'Вы забыли указать папки с фотографиями'
    })
  } else if (!numbersStr) {
    swal({
      type: 'error',
      title: 'Ошибка',
      text: 'Вы забыли указать номера фотографий'
    })
  } else {
    main(fileNames)
  }
}
