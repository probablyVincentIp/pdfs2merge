import { promisify } from 'util'
import { PDFDocument } from 'pdf-lib'
import {
  readdir as FSReaddir,
  open as FSOpen,
  write as FSWrite,
  close as FSClose,
  readFileSync,
} from 'fs'
import { join } from 'path'

const readdir = promisify(FSReaddir)
const open = promisify(FSOpen)
const write = promisify(FSWrite)
const close = promisify(FSClose)

async function merge(sourceDir?: string) {
  const directoryPath = join(__dirname, '../pdf')

  try {
    const pdfFiles = await readdir(directoryPath)
    const pdfsToMerge: Buffer[] = []

    for (const file of pdfFiles) {
      if (file.endsWith('pdf')) {
        const path = join(__dirname, `../pdf/${file}`)
        if (path) pdfsToMerge.push(readFileSync(path))
      }
    }
    console.log(`merging ${pdfsToMerge.length} pdf files`)
    const mergedPdf = await PDFDocument.create()
    for (const pdfBytes of pdfsToMerge) {
      const pdf = await PDFDocument.load(pdfBytes)
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page)
      })
    }

    const buf = await mergedPdf.save() // Uint8Array

    const fileName = 'merged.pdf'
    const fd = await open(fileName, 'w')
    await write(fd, buf, 0, buf.length, null)
    await close(fd)
    console.log('wrote the file successfully')
  } catch (e) {
    console.error('something went wrong:', e)
  }
}

;(async () => await merge())()
