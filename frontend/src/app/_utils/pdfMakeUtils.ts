export function setVfs(vfs: any) {
  // Vous pouvez vérifier si pdfMake existe déjà pour éviter les erreurs
  // @ts-ignore
  if (typeof pdfMake !== 'undefined') {
    // @ts-ignore
    pdfMake.vfs = vfs;
  }
}
