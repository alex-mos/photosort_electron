const fs = require('fs-extra')
const path = require('path')

let src, dest

// преобразует строку с номерами в массив
const numbersToArr = (str) => {
  return str.split('\n').filter(num => num !== '')
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
      console.log(`некорректный номер фотографии: ${num}`)
  }

  return `DSC${num}.JPG`
}

// копирует файл
const cp = (fileName) => {
  fs.access(path.join(src, fileName), fs.constants.R_OK, (err) => {
    if (err) {
      console.log(`${fileName}: не найден`)
    } else {
      fs.copy(path.join(src, fileName), path.join(dest, fileName), (err) => {
        if (err) {
          throw err
        } else {
          console.log(`${fileName}: ок`)
        }
      })
    }
  })
}

// проверка доступа и корректности путей
const main = (fileNames) => {
  fs.access(src, fs.constants.R_OK, (err) => {
    if (err) {
      console.log('невозможно прочитать исходные фотографии')
    } else {
      fs.access(dest, fs.constants.W_OK, (err) => {
        if (err) {
          console.log('невозможно записать фотографии')
        } else {
          // копирование файлов по очереди  
          fileNames.map(fileName => cp(fileName))
        }
      })
    }
  })
}

// запись адресов папок
document.querySelector('#input-src').onchange = function(e) {
  document.querySelector('#input-src-name').value = e.target.files[0].name
  src = e.target.files[0].path
}

document.querySelector('#input-dest').onchange = function(e) {
  document.querySelector('#input-dest-name').value = e.target.files[0].name
  dest = e.target.files[0].path
}

// запуск программы по нажатию на кнопку Copy
document.querySelector('button').onclick = function(e) {
  e.preventDefault()
  let numbersStr = document.querySelector('#photonumbers').value
  // преобразуем строку с номерами в массив
  let numbersArr = numbersToArr(numbersStr)
  // массив номеров - в массив названий файлов
  let fileNames = numbersArr.map(num => nameBuild(num)).sort()

  main(fileNames)
}
