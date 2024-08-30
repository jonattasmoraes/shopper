import { GoogleAIFileManager } from '@google/generative-ai/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

export async function geminiProvider(imageBase64: string) {
  const filePath = saveImageToFile(imageBase64)

  try {
    const fileUri = await uploadImage(filePath)
    const generatedText = await generateTextFromImage(fileUri)

    return { text: generatedText, uri: fileUri }
  } catch (error: unknown) {
    console.error(error)
    throw error
  } finally {
    deleteFile(filePath)
  }
}

function saveImageToFile(imageBase64: string): string {
  const filePath = path.join(__dirname, 'temp.jpg')
  fs.writeFileSync(filePath, Buffer.from(imageBase64, 'base64'))
  return filePath
}

async function uploadImage(filePath: string): Promise<string> {
  const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!)
  const {
    file: { uri },
  } = await fileManager.uploadFile(filePath, { mimeType: 'image/jpeg' })
  return uri
}

async function generateTextFromImage(fileUri: string): Promise<string> {
  const model = getGenerativeModel()
  const result = await model.generateContent([
    { fileData: { mimeType: 'image/jpeg', fileUri } },
    {
      text: 'Analise a imagem de um medidor de água ou energia (analógico ou digital) e extraia o valor inteiro que representa o consumo. Retorne apenas o valor da leitura do medidor, priorizando a precisão na identificação dos números exibidos. Dê preferência aos valores próximos ao kWh, se disponíveis; caso contrário, retorne o valor mais evidente.',
    },
  ])
  return result.response.text()
}

function getGenerativeModel() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
}

function deleteFile(filePath: string): void {
  try {
    fs.unlinkSync(filePath)
  } catch (error) {
    console.error('Failed to delete temporary file:', error)
  }
}
