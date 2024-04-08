import { ITableItems } from 'src/utils';

export async function processTableItems(
  tableItemsRecords: (ITableItems | ITableItems[])[]
): Promise<ITableItems[][]> {
  const tableDataWithImage: ITableItems[][] = await Promise.all(
    tableItemsRecords.map(async (item: ITableItems | ITableItems[]) => {
      if (Array.isArray(item)) {
        const updatedArray = await Promise.all(item.map(processArrayElement));
        return updatedArray;
      } else if (typeof item === 'object' && 'image' in item) {
        return [await processObjectWithImage(item)];
      } else {
        return [item];
      }
    })
  );
  return tableDataWithImage;
}
export async function processArrayElement(
  arrayElement: ITableItems
): Promise<ITableItems> {
  if (typeof arrayElement === 'string') {
    return arrayElement;
  } else if (
    'image' in arrayElement &&
    typeof arrayElement.image === 'string'
  ) {
    return processObjectWithImage(arrayElement);
  } else {
    return arrayElement;
  }
}
export async function processObjectWithImage(objectWithImage: {
  [key: string]: any;
}): Promise<ITableItems> {
  const { image, ...rest } = objectWithImage;
  const imageDataUrl = await getImageDataUrl(image);
  return {
    ...rest,
    image: imageDataUrl,
  };
}

export async function getImageDataUrl(imageUrl: string): Promise<string> {
  try {
    // Add a dummy GET parameter to the URL
    const urlWithDummyParam = `${imageUrl}?dummy=${Date.now()}`;

    const response = await fetch(urlWithDummyParam);
    const blob = await response.blob();
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return '';
  }
}
