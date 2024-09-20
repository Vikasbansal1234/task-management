// ../apps/task-management-service/src/domains/shared/utils/excel.util.ts
import * as xlsx from 'xlsx';
import { BadRequestException } from '@nestjs/common';

// Utility function to parse CSV file buffer into JSON
export const parseCsvToJson = (buffer: Buffer): any[] => {
  try {
    if (!buffer || buffer.length === 0) {
      throw new BadRequestException('Buffer is empty or not valid');
    }

    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    if (!sheet || !sheet['!ref'] || sheet['!ref'] === 'A1') {
      throw new BadRequestException('The CSV file does not contain valid data');
    }

    // Convert sheet to JSON format
    const jsonData: any[] = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    if (!jsonData || jsonData.length === 0) {
      throw new BadRequestException('The CSV file does not contain any valid data');
    }

    return jsonData;
  } catch (error) {
    throw new BadRequestException(`Failed to parse CSV file: ${error.message}`);
  }
};

// Utility function to parse XLSX file buffer into JSON
export const parseXlsxToJson = (buffer: Buffer): any[] => {
  try {
    if (!buffer || buffer.length === 0) {
      throw new BadRequestException('Buffer is empty or not valid');
    }

    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    if (!sheet || !sheet['!ref'] || sheet['!ref'] === 'A1') {
      throw new BadRequestException('The XLSX file does not contain valid data');
    }

    // Convert sheet to JSON format
    const jsonData: any[] = xlsx.utils.sheet_to_json(sheet, { header: 0 });

    if (!jsonData || jsonData.length === 0) {
      throw new BadRequestException('The XLSX file does not contain any valid data');
    }

    return jsonData;
  } catch (error) {
    throw new BadRequestException(`Failed to parse XLSX file: ${error.message}`);
  }
};
