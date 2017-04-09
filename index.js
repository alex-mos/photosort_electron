// const picture = require('cat-picture')
// const lightningImagePoly = require('lightning-image-poly')
//
// var src = picture.src
// picture.remove()
//
// var viz = new lightningImagePoly('#visualization', null, [src], {hullAlgorithm: 'convex'})

// const remote = require('electron').remote
// const fs = require('fs')
//
// function save () {
//   remote.getCurrentWindow().webContents.printToPDF({
//     portrait: true
//   }, function (err, data) {
//     fs.writeFile('annotation.pdf', data, function (err) {
//       if (err) alert('error generating pdf!' + err.message)
//       else alert('pdf saved!')
//     })
//   })
// }
//
// window.addEventListener('keydown', function (e) {
//   if (e.keyCode == 80) save()
// })


const fs = require('fs-extra')
const path = require('path')

// const root = '/Users/ugo/группы\ 2017'
const root = '/Volumes/WD/Группы\ 2017'

const src = path.join(root, process.argv[2])
const dest = path.join(path.join(root, 'на вёрстку'), process.argv[3])

// console.log(src)
// console.log(dest)

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
  let srcPath = path.join(src, fileName)
  let destPath = path.join(dest, fileName)
  // console.log(destPath)
  fs.access(srcPath, fs.constants.R_OK, (err) => {
    debugger;
    if (err) {
      console.log(`${fileName}: не найден`)
      return false
    } else {
      fs.copy(srcPath, destPath, (err) => {
        if (err) {
          throw err
        } else {
          console.log(`${fileName}: ок`)
        }
      })
    }
  })
}

// проверка доступ и корректность путей
fs.access(src, fs.constants.R_OK, (err) => {
  if (err) {
    console.log('невозможно прочитать исходные фотографии')
  } else {
    fs.access(dest, fs.constants.W_OK, (err) => {
      if (err) {
        console.log('невозможно записать фотографии')
      } else {
        fs.access(path.join(dest, 'photos.txt'), fs.constants.R_OK, (err) => {
          if (err) {
            console.log('не найден файл со списом фотографий')
          } else {
            // парсинг файла с номерами фотографий
            fs.readFile(path.join(dest, 'photos.txt'), (err, data) => {
              let numbers = data.toString().split('\n')
              let fileNames = numbers.map(number => nameBuild(number))
              fileNames.map(fileName => cp(fileName))
            })
          }
        })
      }
    })
  }
})
