import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {InvoiceModel} from "../../models/invoice.model";
import {setVfs} from "../_utils/pdfMakeUtils";

// PDF MAKE IMPORTS
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import {TrainingModel} from "../../models/training.model";
import {ClientModel} from "../../models/client.model";
//
import n2words from 'n2words';
import {StandardInvoice} from "../../models/standardInvoice";
import {TrainingInvoice} from "../../models/trainingInvoice";
import {map, Observable} from "rxjs";
import {group} from "@angular/animations";

setVfs(pdfFonts.pdfMake.vfs)

@Injectable({
  providedIn: 'root'
})
export class InvoicingService {

  // Months and Days
  months: string[] = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  days: string[] = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  // private host: string = "http://57.128.221.44:8888/INVOICING-SERVICE"
  private host: string = "http://51.254.114.223:8888/INVOICING-SERVICE"

  constructor(private http: HttpClient) {
  }

  formatDate(dateString: string): string {
    const dateParts: string[] = dateString.split('-');
    const year: string = dateParts[0];
    const month: string = this.months[parseInt(dateParts[1]) - 1];
    const day: number = parseInt(dateParts[2]);
    const dayOfWeekIndex: number = new Date(dateString).getDay();
    const dayOfWeek: string = this.days[dayOfWeekIndex];

    return `${dayOfWeek} ${day} ${month} ${year}`;
  }

  formatDateToDDMMYYYY(dateString: string): string {
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);      // Ajoute un zéro au début si nécessaire
    const month = ('0' + (date.getMonth() + 1)).slice(-2);  // Mois de 0 à 11, donc +1
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;  // Retourne la date au format "jj/mm/AAAA"
  }


  /************************************************************************/
  public generate(training: TrainingModel, client: ClientModel) {
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const date = new Date()
    const formattedDate = `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    const billNum = `${year.toString().substring(2, 4)}0${month}-001`
    const datesText = training.trainingDates.map((date: string) => '- ' + this.formatDate(date)).join('\n');
    const docDefinition: any = {

      info: {
        title: `bill-${year.toString().substring(2, 4)}0${month}-001`,
        author: 'babaprince',
        subject: 'Bill',
        keyword: 'bill'
      },
      pageSize: 'A4',
      // margin: [left, top, right, bottom]
      pageMargins: [40, 60, 40, 120],

      watermark: {
        text: 'GALAXY SOLUTIONS',
        color: '#9CCDC1',
        opacity: 0.1,
        bold: true,
        italic: false
      },

      header: [
        {
          margin: [40, 10, 40, 10],
          columns: [
            [
              {
                image: 'data:image/png;base64,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', // Chemin vers votre image
                width: 150, // Largeur de l'image en pixels
                height: 75, // Hauteur de l'image en pixels
                margin: [10, 10, 0, 0] // Marges de l'image (haut, droite, bas, gauche)
              },
              {
                text: 'Etudes Conseil Formation'
              }
            ]
          ]
        }
      ],

      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 80]
        }
      },

      footer: [
        {
          margin: [20, 0, 0, 10],
          table: {
            widths: [550],
            heights: [8],
            body: [
              [
                {
                  text: 'www.galaxysolutions.ma',
                  fontSize: 14,
                  color: '#FFF',
                  fillColor: '#FF5E0E',
                  bold: true,
                  alignment: 'center',
                  margin: [0, 5, 0, 0]
                },
              ],
              [
                {
                  text: "Galaxy Solutions SARL, Bureau d'études, Conseil et formation",
                  fontSize: 10,
                  color: '#FFF',
                  alignment: 'center',
                  fillColor: '#808080'
                },
              ],
              [
                {
                  text: 'Bd Zerktouni Res Kamal Parc Center Imm B Etg 2 Bureau N° 08 MOHAMMEDIA',
                  fontSize: 10,
                  color: '#FFF',
                  alignment: 'center',
                  fillColor: '#808080'
                },
              ],
              [
                {
                  text: 'Compte N°: 0111100000012100001038207 BANK OF AFRICA',
                  fontSize: 10,
                  color: '#FFF',
                  alignment: 'center',
                  fillColor: '#808080'
                },
              ],
              [
                {
                  text: 'IF: 14405562 RC: 32589 TP: 39581102 CNSS: 9301201 ICE: 000216179000045',
                  fontSize: 10,
                  color: '#FFF',
                  alignment: 'center',
                  fillColor: '#808080'
                },
              ],
              [
                {
                  text: 'GSM: 0661 16 07 06 Email: Contact@galaxysolutions.ma',
                  fontSize: 10,
                  color: '#FFF',
                  alignment: 'center',
                  fillColor: '#808080'
                }
              ]
            ]
          },
          layout: {
            defaultBorder: false
          }
        },
      ],

      content: [
        {
          margin: [0, 120, 0, 0],
          table: {
            headerRows: 1,
            widths: ['auto', '*', '*'],
            body: [
              [
                {text: 'Entreprise', bold: true, style: 'tableHeader'},
                {text: 'Facture N° : ', bold: true, style: 'tableHeader'},
                {text: 'Date :  ', bold: true, style: 'tableHeader'}
              ],
              [
                [
                  {text: client.corporateName, bold: true},
                  {text: client.address},
                  {text: `ICE : ${client.commonCompanyIdentifier}`},
                ],
                {text: billNum, bold: true, alignment: 'center'},
                {text: formattedDate, bold: true, alignment: 'center'},
              ],
              [
                {text: 'Lieu de formation'},
                {text: training.location, colSpan: 2},
              ],
            ]
          }
        },
        {
          table: {
            widths: ['*', 135, '*', '*'],
            body: [
              [
                {text: 'Thème', border: [true, false, true, true]},
                {text: 'Jours réels de formation', border: [true, false, true, true]},
                {text: 'Nombre de bénéficiaires', border: [true, false, true, true]},
                {text: 'Montant HT', border: [true, false, true, true]},
              ],
              [
                {text: training.theme},
                {text: datesText},
                {text: training.staff},
                {text: training.amount},
              ],
              [
                {text: 'Total HT', alignment: 'right', colSpan: 3},
                {},
                {},
                {text: training.amount},
              ],
              [
                {text: 'TVA 20%', alignment: 'right', colSpan: 3},
                {},
                {},
                {text: ''},
              ],
              [
                {text: 'Total TTC', alignment: 'right', colSpan: 3},
                {},
                {},
                {
                  text: training.amount + training.amount * 0.2,
                  fillColor: '#FF5E0E',
                  color: '#FFF'
                }
              ]
            ]
          }
        },
        {
          text: `Arrêtée la présente facture de formation à la somme de ${training.amount + training.amount * 0.2}`,
          margin: [15, 10, 0, 50]
        },
        // Done
        {
          text: 'Yassine DAOUD',
          bold: true,
          alignment: 'right',
          margin: [0, 0, 60, 10]
        },
        // Done
        {
          text: 'Directeur Général',
          bold: true,
          alignment: 'right',
          margin: [0, 0, 50, 0]
        },
      ]
    }

    pdfMake.createPdf(docDefinition).open()
  }

  /************************************************************************/

  /************************************************************************/
  public generateInvoiceWithMultipleTrainings(trainingList: TrainingModel[], client: ClientModel) {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const date = new Date();
    const formattedDate = `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    const billNum = `${year.toString().substring(2, 4)}0${month}-001`;

    let totalAmount = 0;

    // Création des lignes de la table des formations
    let trainingRows = trainingList.map((training) => {
      const datesText = training.trainingDates.map((date: string) => '- ' + this.formatDate(date)).join('\n');
      totalAmount += training.amount;
      return [
        {text: training.theme},
        {text: training.completionDate},
        {text: training.staff},
        {text: training.amount}
      ];
    });

    // Convertir le montant total en toutes lettres en français
    const totalAmountWithTax = totalAmount + totalAmount * 0.2;
    const totalAmountInWords = n2words(totalAmountWithTax, {lang: 'fr'});

    // Définir un caractère invisible
    const invisibleSpace = '\u200B'; // espace zéro largeur

// Utiliser le caractère invisible avant la variable
    const textWithSpace = `${invisibleSpace} ${totalAmountInWords}`;


    const docDefinition: any = {
      info: {
        title: `bill-${year.toString().substring(2, 4)}0${month}-001`,
        author: 'babaprince',
        subject: 'Bill',
        keyword: 'bill'
      },
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 120],
      watermark: {
        text: 'GALAXY SOLUTIONS',
        color: '#9CCDC1',
        opacity: 0.1,
        bold: true,
        italic: false
      },
      header: [
        {
          margin: [40, 10, 40, 10],
          columns: [
            [
              {
                image: 'data:image/png;base64,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', // Chemin vers votre image
                width: 150,
                height: 75,
                margin: [10, 10, 0, 0]
              },
              {
                text: 'Etudes Conseil Formation'
              }
            ]
          ]
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 80]
        }
      },
      footer: [
        {
          margin: [20, 0, 0, 10],
          table: {
            widths: [550],
            heights: [8],
            body: [
              [
                {
                  text: 'www.galaxysolutions.ma',
                  fontSize: 14,
                  color: '#FFF',
                  fillColor: '#FF5E0E',
                  bold: true,
                  alignment: 'center',
                  margin: [0, 5, 0, 0]
                }
              ],
              [
                {
                  text: "Galaxy Solutions SARL, Bureau d'études, Conseil et formation",
                  fontSize: 10,
                  color: '#FFF',
                  alignment: 'center',
                  fillColor: '#808080'
                }
              ],
              [
                {
                  text: 'Bd Zerktouni Res Kamal Parc Center Imm B Etg 2 Bureau N° 08 MOHAMMEDIA',
                  fontSize: 10,
                  color: '#FFF',
                  alignment: 'center',
                  fillColor: '#808080'
                }
              ],
              [
                {
                  text: 'Compte N°: 0111100000012100001038207 BANK OF AFRICA',
                  fontSize: 10,
                  color: '#FFF',
                  alignment: 'center',
                  fillColor: '#808080'
                }
              ],
              [
                {
                  text: 'IF: 14405562 RC: 32589 TP: 39581102 CNSS: 9301201 ICE: 000216179000045',
                  fontSize: 10,
                  color: '#FFF',
                  alignment: 'center',
                  fillColor: '#808080'
                }
              ],
              [
                {
                  text: 'GSM: 0661 16 07 06 Email: Contact@galaxysolutions.ma',
                  fontSize: 10,
                  color: '#FFF',
                  alignment: 'center',
                  fillColor: '#808080'
                }
              ]
            ]
          },
          layout: {
            defaultBorder: false
          }
        }
      ],
      content: [
        {
          margin: [0, 120, 0, 0],
          table: {
            headerRows: 1,
            widths: ['auto', '*', '*'],
            body: [
              [
                {text: 'Entreprise', bold: true, style: 'tableHeader'},
                {text: 'Facture N° : ', bold: true, style: 'tableHeader'},
                {text: 'Date :  ', bold: true, style: 'tableHeader'}
              ],
              [
                [
                  {text: client.corporateName, bold: true},
                  {text: client.address},
                  {text: `ICE : ${client.commonCompanyIdentifier}`}
                ],
                {text: billNum, bold: true, alignment: 'center'},
                {text: formattedDate, bold: true, alignment: 'center'}
              ],
              [
                {text: 'Lieu de formation'},
                {text: trainingList.map(training => training.location).join('\n'), colSpan: 2}
              ]
            ]
          }
        },
        {
          table: {
            widths: ['*', 135, '*', '*'],
            body: [
              [
                {text: 'Thème', border: [true, false, true, true]},
                {text: 'Jours réels de formation', border: [true, false, true, true]},
                {text: 'Nombre de bénéficiaires', border: [true, false, true, true]},
                {text: 'Montant HT', border: [true, false, true, true]}
              ],
              ...trainingRows,  // Insertion des lignes de formation dynamiquement
              [
                {text: 'Total HT', alignment: 'right', colSpan: 3},
                {},
                {},
                {text: totalAmount}
              ],
              [
                {text: 'TVA 20%', alignment: 'right', colSpan: 3},
                {},
                {},
                {text: totalAmount * 0.2}
              ],
              [
                {text: 'Total TTC', alignment: 'right', colSpan: 3},
                {},
                {},
                {
                  text: totalAmount + totalAmount * 0.2,
                  fillColor: '#FF5E0E',
                  color: '#FFF'
                }
              ]
            ]
          }
        },
        {
          margin: [15, 10, 0, 50],
          columns: [
            {
              text: `Arrêtée la présente facture de formation à la somme de`,
              width: 'auto'
            },
            {
              text: `${textWithSpace} dirhams`,
              bold: true,
              italics: true,
              width: '*'
            }
          ]
        },
        {
          text: 'Yassine DAOUD',
          bold: true,
          alignment: 'right',
          margin: [0, 0, 60, 10]
        },
        {
          text: 'Directeur Général',
          bold: true,
          alignment: 'right',
          margin: [0, 0, 50, 0]
        }
      ]
    };

    pdfMake.createPdf(docDefinition).open();
  }

  /************************************************************************/

  /************************************************************************/
  public generateTrainingInvoicePDF(trainingList: TrainingModel[], client: ClientModel, numberInvoice: string) {
    return new Promise((resolve) => {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const date = new Date();
      const formattedDate = `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;

      let totalAmount = 0;

      // Création des lignes de la table des formations
      let trainingRows = trainingList.map((training) => {
        const datesText = training.trainingDates.map((date: string) => '- ' + this.formatDate(date)).join('\n');
        totalAmount += training.amount;
        return [
          {text: training.theme},
          {text: training.completionDate},
          {text: training.staff},
          {text: training.amount}
        ];
      });

      // Convertir le montant total en toutes lettres en français
      const totalAmountWithTax = totalAmount + totalAmount * 0.2;
      const totalAmountInWords = n2words(totalAmountWithTax, {lang: 'fr'});

      // Définir un caractère invisible
      const invisibleSpace = '\u200B'; // espace zéro largeur

// Utiliser le caractère invisible avant la variable
      const textWithSpace = `${invisibleSpace} ${totalAmountInWords}`;


      const docDefinition: any = {
        info: {
          title: `bill-${year.toString().substring(2, 4)}0${month}-001`,
          author: 'babaprince',
          subject: 'Bill',
          keyword: 'bill'
        },
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 120],
        watermark: {
          text: 'GALAXY SOLUTIONS',
          color: '#9CCDC1',
          opacity: 0.1,
          bold: true,
          italic: false
        },
        header: [
          {
            margin: [40, 10, 40, 10],
            columns: [
              [
                {
                  image: 'data:image/png;base64,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', // Chemin vers votre image
                  width: 150,
                  height: 75,
                  margin: [10, 10, 0, 0]
                },
                {
                  text: 'Etudes Conseil Formation'
                }
              ]
            ]
          }
        ],
        styles: {
          sectionHeader: {
            bold: true,
            decoration: 'underline',
            fontSize: 14,
            margin: [0, 15, 0, 80]
          }
        },
        footer: [
          {
            margin: [20, 0, 0, 10],
            table: {
              widths: [550],
              heights: [8],
              body: [
                [
                  {
                    text: 'www.galaxysolutions.ma',
                    fontSize: 14,
                    color: '#FFF',
                    fillColor: '#FF5E0E',
                    bold: true,
                    alignment: 'center',
                    margin: [0, 5, 0, 0]
                  }
                ],
                [
                  {
                    text: "Galaxy Solutions SARL, Bureau d'études, Conseil et formation",
                    fontSize: 10,
                    color: '#FFF',
                    alignment: 'center',
                    fillColor: '#808080'
                  }
                ],
                [
                  {
                    text: 'Bd Zerktouni Res Kamal Parc Center Imm B Etg 2 Bureau N° 08 MOHAMMEDIA',
                    fontSize: 10,
                    color: '#FFF',
                    alignment: 'center',
                    fillColor: '#808080'
                  }
                ],
                [
                  {
                    text: 'Compte N°: 0111100000012100001038207 BANK OF AFRICA',
                    fontSize: 10,
                    color: '#FFF',
                    alignment: 'center',
                    fillColor: '#808080'
                  }
                ],
                [
                  {
                    text: 'IF: 14405562 RC: 32589 TP: 39581102 CNSS: 9301201 ICE: 000216179000045',
                    fontSize: 10,
                    color: '#FFF',
                    alignment: 'center',
                    fillColor: '#808080'
                  }
                ],
                [
                  {
                    text: 'GSM: 0661 16 07 06 Email: Contact@galaxysolutions.ma',
                    fontSize: 10,
                    color: '#FFF',
                    alignment: 'center',
                    fillColor: '#808080'
                  }
                ]
              ]
            },
            layout: {
              defaultBorder: false
            }
          }
        ],
        content: [
          {
            margin: [0, 120, 0, 0],
            table: {
              headerRows: 1,
              widths: ['auto', '*', '*'],
              body: [
                [
                  {text: 'Entreprise', bold: true, style: 'tableHeader'},
                  {text: 'Facture N° : ', bold: true, style: 'tableHeader'},
                  {text: 'Date :  ', bold: true, style: 'tableHeader'}
                ],
                [
                  [
                    {text: client.corporateName, bold: true},
                    {text: client.address},
                    {text: `ICE : ${client.commonCompanyIdentifier}`}
                  ],
                  {text: numberInvoice, bold: true, alignment: 'center'},
                  {text: formattedDate, bold: true, alignment: 'center'}
                ],
                [
                  {text: 'Lieu de formation'},
                  {text: trainingList.map(training => training.location).join('\n'), colSpan: 2}
                ]
              ]
            }
          },
          {
            table: {
              widths: ['*', 135, '*', '*'],
              body: [
                [
                  {text: 'Thème', border: [true, false, true, true]},
                  {text: 'Jours réels de formation', border: [true, false, true, true]},
                  {text: 'Nombre de bénéficiaires', border: [true, false, true, true]},
                  {text: 'Montant HT', border: [true, false, true, true]}
                ],
                ...trainingRows,  // Insertion des lignes de formation dynamiquement
                [
                  {text: 'Total HT', alignment: 'right', colSpan: 3},
                  {},
                  {},
                  {text: totalAmount}
                ],
                [
                  {text: 'TVA 20%', alignment: 'right', colSpan: 3},
                  {},
                  {},
                  {text: totalAmount * 0.2}
                ],
                [
                  {text: 'Total TTC', alignment: 'right', colSpan: 3},
                  {},
                  {},
                  {
                    text: totalAmount + totalAmount * 0.2,
                    fillColor: '#FF5E0E',
                    color: '#FFF'
                  }
                ]
              ]
            }
          },
          {
            margin: [15, 10, 0, 50],
            columns: [
              {
                text: `Arrêtée la présente facture de formation à la somme de`,
                width: 'auto'
              },
              {
                text: `${textWithSpace} dirhams`,
                bold: true,
                italics: true,
                width: '*'
              }
            ]
          },
          {
            text: 'Yassine DAOUD',
            bold: true,
            alignment: 'right',
            margin: [0, 0, 60, 10]
          },
          {
            text: 'Directeur Général',
            bold: true,
            alignment: 'right',
            margin: [0, 0, 50, 0]
          }
        ]
      };

      const pdfDocGenerator = pdfMake.createPdf(docDefinition);

      pdfDocGenerator.getBlob((blob) => {
        resolve(blob);
      });
    })
  }

  /************************************************************************/

  public generateStandardInvoice(productList: any[], client: ClientModel | undefined, reference: string) {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const date = new Date();
    const formattedDate = `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    // const billNum = `${year.toString().substring(2, 4)}0${month}-001`;

    let totalAmount = 0;

    // Création des lignes de la table des formations
    let productRows = productList.map((product) => {
      // const datesText = product.trainingDates.map((date: string) => '- ' + this.formatDate(date)).join('\n');
      product.total = product.unitPrice * product.quantity
      totalAmount += product.total;
      return [
        {text: product.name},
        {text: product.quantity},
        {text: product.unitPrice},
        {text: product.total}
      ];
    });

    // Convertir le montant total en toutes lettres en français
    const totalAmountWithTax = totalAmount + totalAmount * 0.2;
    const totalAmountInWords = n2words(totalAmountWithTax, {lang: 'fr'});

    // Définir un caractère invisible
    const invisibleSpace = '\u200B'; // espace zéro largeur

// Utiliser le caractère invisible avant la variable
    const textWithSpace = `${invisibleSpace} ${totalAmountInWords}`;
    const textWithSpaces = `${invisibleSpace}`;


    const docDefinition: any = {
      info: {
        title: `bill-${year.toString().substring(2, 4)}0${month}-001`,
        author: 'babaprince',
        subject: 'Bill',
        keyword: 'bill'
      },
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 120],
      watermark: {
        text: 'GALAXY SOLUTIONS',
        color: '#fa8e71',
        opacity: 0.1,
        bold: true,
        italic: false
      },
      header: [
        {
          margin: [40, 10, 40, 10],
          columns: [
            [
              {
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAABuCAYAAAAZOZ6hAAAABHNCSVQICAgIfAhkiAAAIABJREFUeJzsnXeclNX1/z/n3GfK7tJVFJUOimCLvaPElhhLosFeYjTGqESRIrC7zzwzu7RFiBhjiCbGEgsazTfGxN5b7A0LghQREUWk7U557jm/P5Zdd8ruzuwuLb95v14T4n1uOTM7Z247BShSpEiRIkWKbH5oSwtQpMiWRN+YE4AJdPNB/Qjal1LoC6M2rRKBIVQnLPNUA98FHFpI+1ywYctInE5RgYv8f0fttB67Or4epaJHCfHhAHoD6ELEreqDivikWEFMnyj5ryrJf8KB0ndo7FdbRKGLClzk/wt09qAuiVT8DLLOz4VwJBGXdVTfpLJI1d7PxtwdvHbxux3Vb15jb87BihTZ3NRO672zcQKXQuRCJe6/KcdSFcsiz6vjVIev/eypTTlWA0UFLvI/ibq9SpNlgTECGkNsOm8BCZ5XsRNLxi19aVOOUlTgIv9zJGr6nyzADCLabUvKoWLXMXCHD1SVjVuyYlOMUVTgIv8z6E1DOyU3rL9B2bl4S8uShtqVID4vPGbREx3ddVGBi/xPkKzpvaeF8zci2nuLCqIKQKFQJWCVCr4CkyGgK5H9fWjM55M7criiAhfZ5qmb3vtIgpkL5p22iABqAREokUWg83xjaJ76do34tb1APAjQ3kRcAgAK+2CY7Xk0elldRwxdVOAi2zTJmr7nWKU7iZk368BqAT9ZP9N26f0ul3R7nEzZ55r8eqBs+PpQ9VN7Eag0Z1O1j4TX4wzylsTbK0ZRgYtssyRn7HquFeeOzae8CqTigE2Cu/T+FLvsey+Xbf88/FR3f+nLpyC+9kfw67YDGYBaVq2OUuKiAhfZJknN7H+QL/oMgXPOch2K+ECqFsrOOmfADx/EgCNucTrt+Jkseu641JJXf4O1XxwMYoANClEpVX04vH7RaeRB2ipaUYGLbHPUXT+wN4n/CsjssulGUcAm62fczju/b4addqvT/9TbEUwl/Q8eulQ++tdorfu6LwIlADttH0Zkanjc4gltbV5U4CLbFOoODSbKNjwJNkduohHq97aSSpkeezzKe536e+fw0Y/rp5+G/E9mX2k/+Ps42GRPBDsB1DErd9b4mcGxy+e2pW1RgYtsU9TV9I4QBdxN0rkfh4rdwD363x88ZuIs2v2U91SVUv8Ze4m8fbsLol0QLEOHq43alcR8ZOjaRfMLbVpU4CLbDKmZ/Q/yfXmB2AQ7tGM/Dk2ur+NdD7kzeNSEGhp0zAIASL1Qc7R9644ZWL9if4Q6YZOqi9q54bFLziy0WVGBi2wTqIISNX1fAJvDO6xTm4SmNlhnl0Pvdg6+OEZDz/gUAPSLj7bznxo3zV/y/MUU7EIwgQ4bsiVY7bnBsUvuLqRNUYGLbBMkZuxyhiJ0f4d0pgok1wFd+z9vfnDhdYHDr3yl4ZH/0vU/9p+bdjPI9EGgFIB2yJD5iaXvhbv0OIAuezOVb5vNe/ldpEgbUAWpDVzbIZ35dUCqdiUfeOkloSteO7pBeVXVJB+8ZIr/TPUjCJT2QaAEm1N5AYCI9o6vW3VOQW02lTBFinQUiet3OV019ED7O1oH3mHoQ4GjK6+i3X74RUOxfvn2Dsn7z71L1319PEJbwPOwCar6XjhkDqJRCxL51C/OwEW2fnzn8na1Fwut/SZhhp08Kvir536WpryLn+ufuO+cJ3XD6uMR6tJuUdsLEe2dTCWPy7d+O26gixTZ9CSv7/sDKzSizUtFmwLILHdO+cPIwL7npTnX60cP9Yvfd85/CNh9c+93W0KULgTwr3zqFmfgIls1VuTUfILN5UR8EPGi0M/+eHyW8q5+u1viP9fdT4rdYULYWpQXAEhx9PqaHXvmU7eowEW2boh+0qZ2qkBy/Vd0QuwUGnTivMzHyf8bPw3x7w6AE263iB0Ome2DyeSx+VQtKnCRrZbEtL57QLBPmxqnNsAZPubXwX0u+CDr0dt/GS6fv3ZpvVXV1jPzNkWUTsmnXlGBi2y1CMUPJjaFn9PYJLh7/4ecIyf+I+fzDx68mJySrfoGhogO1GfcVpcHRQUustXCavZvU0M/AbPXGffmeqSqxl/+zr4IbIVL5yaIYtdk/Lu+rdUrKnCRrRflPdvaVEx4Za5yIrJU0rMW4rddrs0AsQkacfq0Vq+owEW2SnTFu2VKOrBNjdlAl7x6THOPTZ9970Z8TZtl21wobKthcYsKXGTrJJhyoGjbOjdQCrvw8XH2sUk5vXsCp/3lRt7tpGpNrLPw6+rjW7WIAirf/6t2Yxv5/t9NAAn2aK1O0ZCjyNZJnekP5h3a2pxCncLJN/50d/LWY0byXj+dYwb96FXabvDahufBs+4p13lz/5p6+/ZfyrfLjoZf21utLYXWT2oE64PYV0KcYXyEShJqkz4CZSmwo7DxEBJrS+CUlqhf1xXJtWUEEEwIMIEOcfZXRrfW6hQVuMjWiSPtPGUiUKgzyzfzfyZPRH/mPz9rReKPh86DCS9Ejz5fMswqWfnp1zzgxP+Cn1wI1T66btUOunZxd6VgKSlCAIjEV4TDoJIedTa+Jun0HLyAd9jnZTNg75eo709Wq67shFXfdsG3C3vKV/P38D995Eh8u/BHmlzfD8FOHfJRtERRgYv8b+OE6l8qO+maz3cC9If4+kNYABYCgAATApjrI0lyCARAydS3pwCQiEPji8DEkEUvQT57HvatksWpp9xpwA5/ou17rgewHMA7AO7R5ctL/fdm/MJ//fbJFO7SpbUIle16e5us5yJFtiaIgYZAHiZUYFsCaKOqbOxDRfrZV268WRY+dSCAX6ZV33nnWgA3+c9PW5B6+YZHyAmZTeX4VzzEKlKkLRAD4W7Qrz642P/vjSNyVXGOGv8Yd975KdhNd2VVVOAiWydJ+kbV5uUTu0VhB7p22X7NPVY2X23S4Tdl50WKtJky+ZqU1rZecUuj4EDnnEqqy5eXat2ag9HGxBGk+Lq1OkUFLrJ10n3dBiVt9Qu8RVEFTHgVDzrlmVyPU+9MO5cS3+2GhgOxQrsnLGitTlGBi2yVEB3jQ3nJlpajeQhIrgf3O/RPtOveyzKf6icPD5F376uCU9L2EQgftVanqMBFtlqI9K0tLUOz2DjQaYfXAkfNrsp8pAse6x3/x5UPwAR7tvUKSUXWGqFPWqtXVOAiWy1E5tUtLUNOJAX4yc9DJ0y5YOOVUSP66dMDE3+/9D8EO6xdOZNUF+GkWctbq5b3CDNnziwJBDCMlfe3gqFM0hvK3RWoT1xMklRgAwPfEvHngM5X0vficfvR2LFjN7T9nQCqSjfddMNJsLSdsloSIgApcpx/XXHFFesL7c913WDPHj0OEpYgALCwwnFeb0tfuXjppZdOYtXthcgSCQHwEwn/4WOOOabg/v/7wgtDfeaDATTECg4AWHD44Ye/UGhfbzzzzPaJYPBEIiFVVgABo/rpIUcc8eIrr7yyC6w9VogaDIMDRPTOYYcd9nah4wDAyy+/fAKp9hLAZ8ARYOnhhx/+dCF9+AG8ySm7htjp2hYZOh6qn3mJP+dTbv4JDTk1bYb0/3vziMSDF90OyK5oZ/IINvoqUevRBlqd31130gGsdLFV/TGAPoYLi0+kqsug9LQyV3iet7SQtk1kOEwFL2aNrXaUG518Y+H9VYxjYFpaVyJ/iMSqr2iLfE2ZNGncIRB6iSjDGNbq1VXTpt1QaH8TJ457msFpnjUiUkeGjq2unvZyIX1NmDDufkN8RtMyVfv5/AWL++8+aMCNIEqL/mgFi4Mh/2DPm5HTNa85yq+77ngwHsuQeV1AaW9v2rTFhfQVn97nRbDTcdkY2kOqFhzu9lHg1FtOowFHNuYxUlXjP3jJBP+DB1wq7ea09dCqKZRc9fPQxDWthtJtdgld7br7el7lvxzm14zjXB4MBPoGAwEyxqCQl+M4uzoBc0GA+QdtfTMOBcbmGhscHOW6bsGxQA2ZwdmyBlp13cqHcKB0bElJCYfDYTR9hUqDV02dOrXgmaQkVPZMZl+lpaUlwUDJba7r5hX4DABiXmVVWUnpGZl9lYRLXrz//vttSUn4rcxnZaXhfg6XZu3xWmLKlCndQyWB2dnjlM7ruuOOBd+JEukjhbbZJCTXgbv1ezhw5l1HNVXe5Ft/3icxa49n7Cf/ilHZdh2ivFD9KpjonNdqJUuBXdflmOdVWKL/GuKTiEyH2IApS5uCD1VVuUcR47RczwxjUJD50vZJ1nFUVblHgOxPcz0jMgNTicSvCu2zwnVjIvhrZrlh7OYQzcmnj+qoew4RT8osF9gXSjt3+yUATKr0brUqf8+Wmy+t9ryT8pU3lUhMJTK7p40jWM+ql48ePbou334aUA3NVZV2bcHaDtXnT9rwbdIMO2Ni4NevnEY7H/ANAOg3H3dO3n9uzD4y9lX4G46sj6/VUaPKP8lb9m0+ddMU2HXdTsz6IJFGmZG1iBdBrVV5CkAUSmeR0ggGH8bgI5T0R1C6QDXlWZWHoPbzNKGkbaFB1afxLT6Hf9WUKVO6t6XvjkZ9Gt/SD56oXum6bo9C++3UpctvIHg+s5wYp0Vdt7KltlVV7kGi8sfMcitYYC2f01SpgkJjRJC1XPZVZ+bzGcdi7s+YkfUjpUTlkzzvndba5yI8bsFCUvlnW9q2m+Q6oKzHW86pNx0ZOPXmKUQkqmrsv8dekLz1mHdlwZPlVNItDO7Y5Geicme+dRsPsWbPnh1avfqbBwzxCVkdCtYTyU0BpT9OiEQX59Ox67qlQaaDFfZSVe7OAee1fIVqIBZzR5Dixy1WItPXTyZ/DWBKof13JLGYezQpWgyBahh9WPlyANWF9D169Oi6qa57fkrlWSLTv+kzNuRVed7b5a77cGa76urqXuLH7yIyaflCRPCdcfRst9xLu7+c4HmLo1F3LEC3Z8i9m5+s8wCMak5G13V3IpGZmUtIFfzLjbgF7/3TILoVwNnt6qMQ/Dg0VbvB2eOUac7pXg1R/7iqsn2u+qTEDftMwoYvD0awrMMSfDeFrP9MePzneR9QNkrw3XffzsypvLCvkzEHVbjR6yZ43uJ8O/Y8r3aS6z5T7kbPKXfdH0+aNOnLfNs2ji16XWaZqv1K1WYsx/0rJk+e3Gbn744gX1lV9TeF7F0buM7zlpLh81Rt1nJSVP80xXUHNS2bM2dOQFKpvxKZwelyQsjoL8rLvTdyjVNZ6d0Blfuyn+iVsZjbbKziAOsMkEkLwiaClY7qb1t+Z60THrvkaYI8295+WkVSQHwNaMe97w+f+cDegTPuiAGLff8p76eJG/d80X9p1j+RXH0wQp03ifICABxzcyHVGQBiMfdYBn6T9VTwrLV8bEVFRasWIS1BRAXvf2Mx90RDnJYjRgTfgvksUZO+PCezi01taPcJcluJxdzjM3/8VO1qhnO2qEmzJmLGzg7rlW0Zp7zce5mJf51ZzoydLNFtrvt9GNKVK764nhjHZ9VVvbaiwssdbrUBExwrgrQ7SCJDKjLTdd0sL/UqzzsfxOdmjUU0ZoLnfdbK28oLJa5Sbds5Suud+0ByPTTc7TkzInZ46BePjsTg3b9MvjDtF/GaX7zuvzL7QcTXHYpQV3T0crkpJPJo6NpFBaVQZQAQ0TFZT9QuoUDgHM/ztoxBuaWxWWWMeysqvGcNZx/qAPzr6urqXptesBzkkFXJ3DfJdZ9xDP0165nyZa7r7tyWoSZVencBiGY9YBzhsM4AgFjMu5yIr8oeV24s97zftTZGeXn554Y16z0xmb0ChiqalsVisf4KvyazrgjuKnfdvPdyrRG+9rOnSCVnqNg2IykguR4IdHreHDftmJJR7x/t9DliaXLuuVWJ6YfNlxeu/wuR7otwV7TLKCMPVEQEUtCJPwDw5Gj0UIYeldUhnOq2LHs7gljMPYUYaT6WIogD/AcAIBP4Y+ZhC5HZUfxE1pd2UxOLuT8hRtrSUtUmjNWbACDpyxxVm3Z9woyeDmuz+8nWKK+MuFC5J7NclS+LRiM3QPxY5jOr8vDue+x5Tb5jTKr07obK3zLLRTB6cjR65Pcd25lEZsd0Oewiq9ox+XxRnx8YABAIlUNtQXfSOXqr3+MmNvjctc8/zIm/Oyx03P3HEdRJ3jr8n/G7jl8gC5+cBDa7ItgJHXItlAdENLNk3NKXWq+ZDgvkx0QmzeJaBCtNIPBgx4lXGGQp649PJH+rrKycBwCTJk36khl/yayjypdVVVX13hwyNsqVQ1aA7p7keR8AgOd5K4jMn7Pr6K+mum6rcX+bIxAuu0wFaQeDzHAYGEVktmtaLmrfFqGLRo4c2Vr4xTRSQuNEkHbQxQzHR+p6AIh53qU5r/iYR3me105FS0ddcPiaTz9Djuuw/Dqw9ZkKjfmSBwz/nXN0xVHY59wqXfDYSclHz5jvPz7uCVm18GRySkIIbJoDqmZFU30vJMHsVVUeOFblUJMhLAHvTZw4cVVrjV3X3TnIvLsaafGLQZZNUuR9z/O+aa3PKs87HZS+IhBB0ijNzhD85iTRr5jReC3DjB5qk78FkL0l2ARUed5PQXp0a7KmrN5s6mXdvqGMyHRPsVwNYHRbxh4/fvy6Ka57tq/yPJHZpbl6qvZL4uDZnluR171iUzzPW14dda9VUNqhFsMcGI1EbhPVEZmXZqpyQ0VlNK/UmPlCBFUFNAIiWnRrfEb/owA6P6/GKlBFnEp7vGa69foPlfaar8nkHvatv8zWdV/uR6QMJ4wtlRtYReLg+FU0ftG6trRnKGf98RVo1eTRdd2wYfmXkj4Noedaeinp0w5R1nIsR5+smmM/Dtw7yfPea1pwnectJZJbsqvqJVNcd0BrY7UXVSUhP3ufDszNvPP0PG9ZLllV+ZeZp8eFMMHzPjMUOFMEOWO2iMA3FDizoqKiVa+W5phU6c3NZUjCjIsMI20FIWrfDYbLKjLrdhiR+qV0KGiuVLHPtVRVVRNq7UcIdrrXdNtlFoW6vG+/WfKz1PxH77GLn6pCfNUBFCxhBEo362ybCbH5bcmYFVl3/PnCAEqzOiVJ5aibRjAY7EpAv3wHEmBQ01PSnH0ajCTGIWntBEkwz8hV3xearWrTnL6JTNeUoXZfXbTG5Fjk5wxzaNMyVZsyqlkHOgDATujGzH07M7q0V1ZRHcCc2ymFGY7CtntLYQKB66xgcYtyCJJs+Mrx48e3aSbJF50LQ6MWrCXHuUShaSf8KjYJkRVq9TVWfYahKygZP9B+98VYXb3oCqQ2HEhOKAgnvNn2ti1BKteFxyz8U3v6cIjsasCk78WUd2ymfiPJZFINGc3X3ZHJavceOzR7DTBnzpzAyi+/HJv5Y0jAi761qye7bpatsgaD69RPPImMS35S+8tYLPaH9sw8LeG6riNCWbIK6EUKBFbHYrHBxvfTPplEMrk2wPoEkHHdIrh4suveNNHzPi5UjirPO1lU/9KSjZsV+nO15305yXVzRo3Ih0mTJn1V5XmjAW3+XES1urzce7GtY+RFBIoIoO5wh0Y/tyAxY9CPBfbfBOqrYn0irIUCINlD2XSun58E9X4lW5fnLKk/JzR26bTWa7YMKygrbIcAQ1zXbdEfyvO8lUSpG1XwlsC+1PCC4HkVfFioIF+vWDGSGNnBwcge7rAs8Inez3yJH18kylm2x0SmDJLK+8S1UALMPyfGAZnlDD1MbeJTtfaDTFkdlsWifHpWG0apT1SwrJOj0UNF9a7M2VckPc8HM8IC/2+5fgALodx1H1LNtWUBIHh+x5133qSWcGmudcOeU52zfyA0ZsGHhvkkhS4hNg7IbA/mnYjTLc+2OiQ1Pbi+f5tsATJhZpO1lzCMISFjDm6tcYVbHamIRPavrIwd0fAqj0SGM1FBBzOu64ZVdVyuZ0QmRGRCzAhmvjaW51yWq/KF1a7b5ux2zTF79uyQwM9pn91WWYnshdWuu3e+Mkx23d2spu5nRtrJi6idR0S/qr9yS5Orl89yr+u6rabqaBEOTBFBlk+zGvUuu+yyVrddHUIEinlQdH9T1B0aDI5eOI+N/EhhX98s47cTgj8uPO7z8eQ91yGxZhngf+cyYE+p32H3eK0RNDiHGHl/gfOBGWFhbdMJb0us+27V2UymbVnjm4HIhDRPWV3X7WmJ/p558qxqNzgUuLTCdf9MRFkODkzmBw7R7a7rtnktaYxZS2SzPIpUzWZJ9Zft4L6DqDs0GLpmyUfhlJ4AtXdtDjnagoqsJvJPDo1ZmvOMpK1wRUXFQiJ5KPOBIT415nm5Tlk7lJkzZ5ZYlawvrwi+sYL5VrAgj9d8EazI7l3Pq3bdZmP2ForruuFcsqraVe2VVZTPrapys5blGeOXBojuI0bWyoLgXDaxsvIVAKhw3Rqo3J5Vh3GKMXR9Ye/6exKJBKl2jHtpu2iYhYc9p8AOorMHhRDvvy48dsn5QPIKVdshkVU6ClL7JIzZJ3Tt0g69XgMadvYcqFG1q7MGJp0edd1KVd1kf7TaNWsuZDLDMssN0VluJLJ79x499mzt5UYiu4P52ExDfyITyHdmy4egwQVMZq/McoZzdiGykjEjMpeizHBgm5fVdV0OsP4VjKNzPI6Wu27aNV2otPMVAvtKtqy4OhbzNrvFWkfROAs3VeJVu1jga9bZg0LhMcv+YJiOIGuf2sKiQkVWQ+0lwb5LTiy5duHnrbconEbFrPK8C0H615y1BC8TUXT7nXZ6Op+9TpXnnQrSNIN5Vbuwa/cdho0aNaox2r7rup0cljcyHcCtymOuGz2x0DcTjUZuynTKEIGA+bDKysr/NtaLRG5hxiVp8gmerIhE0pwnmlJTU1MWr137OpHZI6Pd4xWRSJYXVx6y3shA2kGGqlVDgcMbZtLW6m8U4J5yN3pOrjGmuO4gn+V5IpNmI65qLZhPq6jwCpoRXNfd3hB91NQgBQAEfEBlZeWbhfTVXlRBDffCGAbCvOEEfM3ABkZkSQIAkjN3+ZmoEyWYoZtVNrHrQHobODBjUyluA40nmOWue7vneT0M6cysWozDFProyhXLPo15lc+CzduALDFq1ghbq4owCW+nwCCoHiCqR+Xjvs/MvySi3bPLqVWD+1wQmZkqyXOJTGPoGmYw6vfzI9vSZwPxeO3FmcoLADDaJl/XgNVZPsu5RKbRUZ7I0Mazh7S4VTHPm0TI9mBSwWu+UpZ3UgMTPG9BLOZeLBYPNz2tJjJGLG6PRqMjKisr322L/FuaBussAEAEwLDngHnDBTuXKCJlAWyXpNC1C/6u03Z/PGn8H0LlNwI5mshsOncikeUguhvMvy8Zs2izxLTOjMgxC0rniOC7XJWJzGAivpRU/0BKjwjkRQi9QkrPgPQBIp1KjDOYkeXvKmpo1apVjWrtum4XaA6DfsHzFRXeo215MxUVFQsByrKRBvHP0wzwC2TatGmdxeaU9cWKCu/fbemz3s0uW1ZDfHpVldtoSloddS8m0uzYw2q/gDGteotVVHiPKlHWCT8zeqjIva7r7tQW+bcGspbTeE7Q/U0BdhCEutbvjbt1iofGLPxHcP2iE43WHgS11ar2XdWWzX/zRQVrSORRRvKckIaGhMcuGru5lBfIcbtd7rr3kDEHqODBbMf5tkPAa5FIpHH5bIDfGEaWyaO2cUZrhAM3qtqsU1ErkuVwny+J2trLDSPL5LG9spIJ3pjrx1J9mgDUb0WsZMe9UrUJMF9Q/4PVOq7rzhLJdv4wjCHMerfrulnWeM3KTHbLH2I1IU2JATTui7u/KfV7Y0Dn7B/AzvubwNiv3w2PXVIeXl92kCFzMFSvgtq7ofa/EFmhKprL57ihTNWuJbELSezjUFsN6PF+mAeHxi3+UXDMsnto/Ceb1AotFzmvFCoqKhZWRCKnKwUOVpVbMp2780EEtSp4TTXlCXjvykjk7DTHfqKs5ajAvr777sP+r9CxMmRflGtmE2DQzJkz25bnIresb/o+WnaMb4Xy8vIlRJLtqUR2IAAo7JG5zSSdqyoqvIJiLFvVq3IdapHywWEgL9/kTp061YmaNCcXEdQSbdkkZGlK3DAbN52Ru78pWN5JERlu1B3uAB/6wTEL3wyPXfT78Ngl54b6Ljk8JDzEGLOXMf4+rPEzlVIXKiXOV8hFUDmSwMNUZI/ghn5DgmOXnBgeu6Q8PGbRE51HLdii+Zta9FKurKx8HcDr9cHusC9SOEBZh0B5FwK6KRBUtspi6hRYq4zlpPQZAx+wYz6YNGnSsuaicVjVCQZ4RpXrfyWBICjwRqEub7nwhaYHmN4F6q2SiCRAbN5tS1READCBwETY5HNNZTXCb1Z6Xrsv49kJ1ajvv99UVqHAuwBAJjiLJPVBw7hEYoTwTXmF+0iF6xY0jud5tVNd96wU0w8J9c4PCjhk5MsJFV6rSbQAYOzYsRuqXfd0AAepcopIAuxgfnl5xacFCbMJaHpHrE2/cZGG//NcfekwEObV21TXKzmAn0OIPlsDoGHl9n7zI30OeB0ldfvZqpZDm4u2nEIX2bZoDALQHA0n2JF045B8siFsTeQdJ8R1XQf1nktcUlKidXV1iUgkkmhLvKt8mDt3rlm0aFGpiDhEJKWlpfGmV1BF/vdQVfrqq69KQ6FQAOiG9R/fn+h96Mg2rZryUMT651vRbNqAqgZXr15dQkSkqtq9e/cEgJy6lvNXSlWpqqpqCCBHq9WDwHYwKXoCKFU1hsiqqEkw2TpSs0qAxaz6JgOPtsWrZu7cuebjjz/ek609Uoj2B9uBpOipaspQ7zGloqaO2K5ipcUi9JZjzHMJa9/0PC9Z6HibagaOxdzjIXo8EScABAX6fmWld0db+priuv181ksAMBGTKtX6Ijd5npfmmF8ddc9S0P4ACv4cWiAI1r+Xl3uvxmKx3UntRaqiRNycUrBY3WCBP2TK1xKxWKy/n6w7UkQOVsJupNqrJFTamYiCykZZU4kyWbvGIfs5gd4H6HkKBF+57LppbTLdvLkhg2XCAAAftklEQVT6txeR6jCAkgCgUIesWf6ldLnJa+N26I9Vvz0K0JMBSgpxwHQfuOBXl19xS74Tm+u6Tq9evfZVa4eD9QAoDVi37rvt/IRfQkQMhohSglVrhXUlgxb6vv9an34D/33hhRd+kTUDx2LuKdWed60ChzHDqXeZM42qXu8+aGDo+3IGjgDoPCs4F8CB+b75qVOndk2lEhd88uGHFwPYG4Y25jKv7/d7V8XG8QaAcCAb/FwgcFg+ibruXwLh8C0TJkzIsiRrFtUlHb17mDZtWudkfP1f0myUhSQajb7blrtWn7WSiH/R8N9ECodZ0CSmdCwWGyyS/EtmSKSOQH0aAWB/ktQkEJ+fmeopEzYEUlK0EvPadV0nwHyqqv5arT0iEAimOXhYlfq5USwsCN9Sd6hiHwA/ATABcVkRiUbnGqLZ+Z7C149bvd9XVm7LekCAz+iOJrvl/Pt0g19Y54+G8P0h54qvEKus/AhAi7Gd5/zqV4EVO/W8wBf/qhXLl6XZ1jMziGjj51BfJvX/M0yAY1Kp1CWw9i4A5zf+VVzX7VblVc4lpf8D46jmnMRbQsnm7SVdHXXP8RMb3ifV2cTYl7lwh00iszsbmuYna9+v8ry8A38z0OGnpqtXr3aAdG+jje+pxSAGzUE5Ay1oWpmqhlVNqC39ty6ALQMAm0OO5rEtuvFVVbmHGCMvg/QBYhybyzuLiJq8AAMLp+mLdScHMkqtfa865rmtub02EDI25GT2tfFVQtatjroX5f8+G3FCSJam9ecYGMdp8TOLxWL9v95552eN49waCgT2cRwHTV8NCtz8i6GsDrDxGmnmzJklxsg/QPzz5gZVtVbVrhPBWlWbcy9KeRi6z549OxTzKm9V0N9ApsVoESKoVbVrNv7b7JKEyOwC0rtjXuUfNu7VW6PDvbvPOeccBIMlEElzxwVz2+7SRZtdrjYSsLYOSHcd7DDUrAMAQ5z3LMdEzcaArnLdq8WnFximxRWaqk1s/Juvz/RtThuLUaqqEWPk8erq6lYDULSGFbq52vN+WEibrl27qlWT9XeSFvKATXXdPpDkE2Ac1lwdVZsSwdqNr5xbo40pdutn2boN68YxzPAsQQTLiOROMD1rLC9NAOsDAUdNSkMC7abM/UF6gMAexzD7A2gxiLfrusE13357LzHnTFYmgpVE8gjBPCFEH7PD36ZSmgoEnIAIdwPZwRA9SpRPzYzHBABEfLkhdFXV8zbV4Vpz9OnTB45hbM5Tto2mkueq6H4qlPWHJuaUqg7K3O+L4Nv6YAxOEjl+zNhQgFX/DwBCJWXReHz9E0RIwqcYGJkBB+9mR28GwMkUcqY7rY55rqpGcv1qiqCWgCdh6N9E8q6T4pVxIB4IOIZTqc6q3FdJDxG1p+Zy42SY4daPP1ZdXX3CpEmTCs5+2NgPI2xF74rFYiPam8igJXzWGURmYGa5Cj5U1TsdY16xbJYzUS0AmFSqxDJ6kGCQqB4iyicA2A2GFgKAM2/evE4P3X//WZl/RhU8HQiFzmhlb/kWgL+7rlthoHsHSktbvA90WH9HRFnKK4I4kVxvlWZ6kWhzhyBLALwL4AHXda8zFr9SlkhTu2cAYMY51TFvMYC2hR/dxtiYZaFZg5KqKvcICKUpMJFd1bX7jlPyOdXfmJz9SQCIRiLLM5WQGZ+1FEqnOuperKqRnA9V7gkoVU7wWryH/hDAf1zX9ZjpZKs6I9Mqjsns4/uJ213X/bHnec3O2q3BjJ3U2nsnT548Ip+orIUyxXUHpZROzvQTEMFfduzV69etOAq9BuDumpqasrVr1w4pKSl7HwCcUCjUFyy9sn6IjU7L92Bo4wneWy3V2eihdHlmuQhWOsxnTKyM5J3QyfO8WgC/q3bdZy3hYWbs2vS5qh1fVeU+Ul7uFZQA+38RFkOZK9FMu/RCuiuk8hTXHeCrTKeMAHL1+ZnoNxWV0bzSowLARsX8P9d1XzBCf890qzTEJ5h6h4/ZOTvIE2LsnUrF75wzZ86pHR1lRJgHMmnavl8E8YDqlHzH2viD2uj5xfV3Tdm+Q6z5mdflw9y5c42QnxVuVATrHebTJlZW5q28TZnkee84zCNzhJAx1mYnGyuyefFZx2UGmQcAVr2iosLNW3mb4nnetynVn6va7ICFLKMLCRukar8QQdY1nyH+0coVX9zYFvlaQliy9YwRtoFs5598YRFZCpasvYMVmlbopr45Pv3ooxEb98jpqLq5fF8LYWJl5StEclNmOUOPj8ViWa6KRTYP9Xmq9IzMchHMLfe8rHzFheB53jdgLs96QKZv0LSSjrYJqsZY1WuaSWx+WczzWsxNXTjOolyHUurTLdFoNCuoRT7w4MGD15JyVjpJZvQU+I9FI5H7qqrcw9oTS0lgT84ss4KlwZKSHClHCkfJuU3Vpi1BiEwIkKM7ov8ihaO+f1TO2dfRWR3Rf9eu2z1sBVlGQ6paSCAI7tSpU6K0tPOFkiMoHpFOrY66Z7VL0CZUVFR8oiSPZI3DGAqR12Je5e8LVWQGgFBJ2dScnipkDDNGQuglY+S1KtcdVVVV1Wwaj+ZQ0qxYTwQ8ed1113VIMLSKiooPFTlC2YrNnvWLbBaE9JCsMrXv77bbsA6JHjlq1KgEAVmHZwItKDiitdYZO3bsBqLgmVCb5ccrKrdOjkYPb4+sTWEOXGslO/MJM0qJ+AqIvBOLRJ6KRt0LXNftkauPtHZA/cbYcUpOtipZWd6/r2j2h6EbxPc/jkYi98Vi7oh8ZuWampoySPZ9L6u+3VrbfCEiVeS4g1TeMulGi0BVsq5KGPRhR3ibNWCIss121Ww3bdq0guNCV1RULILhs0TSjXyITJlo6p6OStdTUVGxKKB6nMDmDEG00fpxBINuN0SfxLzKP0aj0WYnokYFnDhx4qrKSu9UKF2kahc124DRiRkjSekph+i/VZ53ektB75LJZCfksioy2aFs2wMjuz/lli2Dimw6iDTrMEmI23xPmwvN8TcnsiW1tbVtsk4rL/deZaKLsgxIyPROGbl36tSpXZtpWhATPW++tXyEWJ0ggmYT/jFjeyK+jDT1uudVPj45Gs2y1UibQYlIy133dl94T4FeKLCvtGgBxTgApA9Eo+4TLSTpypnXQrXDU51nWWCp1l+GF9kiZP3NSaVD/+aa25suXlJS0ubrn3LXfUhzJCZgmANT8fhf23MW1BTP8+KVnjfVCQaHwOo1LWUzITJkiI8TyLPRSOTOyZMnN54t5BTG87zaykrvjoqK6OFKgYMF+H3uuMv1GOIf+iyvxmLu0ZnPHMdZDyBLkUSkQ/P4CpAV24mUt2i0hP+fIckO9i5Iv69vLyqSa4u0dsCAAe2KC+267g0AsoI7EuO09sTVzsXEiRNXlXve73r26rWvkh4Hlb/lCgnVADPOSyWTL8ZiscFAKxfzRKSVlZWvV1ZGrgqGw0OgdB4EOVMhEpnt1NL9mTl4xo8fv46QniQaAJT1oPzeYuvMnDmzhKFDcshfcI6mjkYk21Y2H5iat6fdJiDJtqFW3qumpqasw4Yg+kH2GObTjthnT6pwx0Dl/sxyBq72PK/Ds19edtllqYoK78lyN3qeLzwEVq9SwXu56hrGEFg7d+rUqV3zXg5cd911a8pd92/lkchwUhoharMOoZixvXC22ZxyeiZ5AGDoiPZkqG9K3bp1h+WyLyUjL3VE//mgqqpEWV8cItumfVMuLyCx2ibn9i0BwWTdahhGv0Rt7YiO6L+6unpHRbpdNgCoapuMgjIhIg2Ey34JybbvJtWZsZj7k7aGaGoNz/NWlHve73cfOnQ/KJ2V69SaGPvaVOLqNq3nJ7nuM506dz9cpd5GtikKHZF5/E2kWYHqiEzXpKEOuSiXHEnBRe28VCr7h2NT0a1bt3UkmrVkV7/wnE9z5841BM06U2DmZg8XtzZSIs/kOqBR1Yn5ugC2hNrUbzLDF6vaBDlO1j1rWxk/fvw6OM5ZqjZtNcH1bvZ/rapyj+AcuaI6ipEjR9py171PVA+3gvmZz636J7d5Qz569Og6JsraJ6ia7o7jpF3gl5dHnsr1S8bAb9roh9lIzPMmECPr8l7h3NKWaB1thYisGsryYmGiFk/pc7Hg448PyUw3o2otiWwzQdg9z1tBJH/LLCfGIQ5rzoTt+RKLuSeq2gmZ5armoY72JCovL/9cKXBmZuohIrOd9elOVbNDR46XC8/zljlEWYnASbETA8A0193Zdd3CbZ9JsvwwiWyCKP30l4iUiCpznWiLyq1Vrnt1oUPPnTvXVEUjMSKdnPlMBW+ISJtsbdsDK2cHpGccVh2J5L1nmj17dkhEsgO5E96Y5HkftFPEzYovNF0k+/yDiK+KRiK3FBKPuoHqqHuWWro/M8OCCL4jY6Ltkbc5Kisr3wTzBSJIC7tjGP0y08y0xhTXHZCPgUYmSprLXrqWFy5cODhl9GVD9H5VNFIzORo9NJ8PNhZzj7ZCseyRzEfl5eVfZBZPct2nAMn6gImMgaFZsUjkqVjMHTFnzpwWrxpqamrKYjH3jI8/fv+/ALLsYVXtGla9zPO8TePo3gLBVOofaiUrF44QXR/zKqe7rtviH3uy6w5dvfqbR3InMOM/dJigbacgVz3P85Yz0W9yOeYz4xImerM66p7XmuGF67rO5Gj0yFgk8n8KuocZnTLrGNZrNqUfb0WF9y8ylJ2dowCqqtyjfJaPHZY3oq47sdp1927t+w7UR69RtVdklqua12nhwoWH333XnU8T4ft9idrPLegDQ/wRrH4O5tUAYIFuDNtXSQ8jxQFEJiuEjipdXOG62bGHNhKNRmYx0OyMawXzDckrIvSxMVhpAZ8tOsFQL6uyFykfyJzbU0oEaw3Rz+p/LJqnynWvhqE0m1wRrKV6c8x8thVha1MvutGqUZRxcOV5lZca4qzlzsYxviXgeVV92xgsV+UERMqUtY8AhzD0sHob7nRU8O+KSOSkPOTKYnI0eqRA0m4OrGCBqO6Vz4/cZNcd6hu6ilRSgP4487BQYN8kpZcB+L7QdM/zsq4bqzzvQoX/51zfFwBQtV8K6GWG/YDJWa7KdVofiqgnwe6h0AMA7EaUO+KLVRrtum6LNtaTo9FDBZK2jRPBymA4vFshJr1V0cgUAC16uinpCRUV3uNZbT3vbJDe3VhPrRU1ixj4gBgfw+oXYrCWlA0DPQR2IJSPzJVOVtWmDAV+6NQfnoqmfW/J9DZAbwA/qo8mV7/yrf/0uT4cXI6PUlVuqXCjzSovAFRWRq7xPG8pw5+S68tqGLsBvBub+lEbYuoBgCFuNhadCj4E83mTKivbZKK5Mdt9lv1uswgNWb58+Q1A+uGC60ZviUYjQ3P9SDGjB4DTCHSaAgApYAgEQnPBxAT2davfB7fb3PhEkxg4B80EtWOY/UHYHwAM9DsAWauscte9PRZzv1Kxf8nMlAgARKaXAU4H+PSGz+X7PzM3G35Q1a5m4l+7bmRu4e+sbZRXRiZEI5E+zMiZEbIV0lYiRMYYwiBgY4ACQ/Xfd1IoAEJL33eeONGrfKFDrErqY1bRxPJK77J86ruuO4uFD7Eqj3XA2N+ppjxf9eDKPJXXcj65E1sZV5WSyWTOz6+yMnKNVbo6M19xoajKbcFg2XGe57XZ7FQ4O5cRk6WuXbvm9RnkCq7XbF3WZutWVHiP+sL7ieBPzcVUy5eNMaPuCAjvO6nSy0t5c30ObcWqXiqwzzX3nKX936/mULVfQ+mCSs+bAQCOqr6ZrEv9VoFzlXRPZu7eWicAICIWpAug9A8TwJ+8yNTPCkn3Mcnz3gFwYkXFhENh9SIojldCX85DuVS1FoK3yejfydh7vEhNs1ZiubDJ5ALbzpBZKd9fEgwGm7X0cl33Bte97mGbsleSyk/JcL98+hXBV0r6ODNuisWm/Lf1Fi0Tj9uvIP4aZm68jxbVTyryvMNMphLzifL8Pqq2uAfduLy+rLy8fAZp4gJATlWlIcytm9Wqqi9KHzPpv5TMHVVVkYL2u6lUfLn4WElkGg+DrNoF78+bV7DVlud5tRMnTjzbwH+amNIMiERkjVHKmRN4fV3d4wFDrgAnMzCEiLL28rlQ1SSg8wC61xfcNmVKrPF7l/aXufvuu7f3fX8gkQ6AoA8RdlLRrgCCAJLEtAagL6H6Gat+tC6RmN9RYUduu+22cJh5DwsMI8ZAFekphM6sTIAklcy3IF0GyCdEgQ/OO++8rNPNQrjrrtv2UnU6E/mFx1DyycBJLTnvvEvzkmHu3LklyeSGPWF5L5AOIKXtLUkpK5Oq1pKhbwm6iJQ/FOb3zjvvvA4Ne3v3Aw8MFks9AVgVwyzOR+ee+5O8wiXNefjh0pL1di/HKMvGLH1MTKLii9J6w9RZLDlstHb+vHfeKyQm1dy5c02dBAY60D2FMBjxdb3ImG4IlBmB+KS6BsRfsuJTZTNvlx26LDzmmGPanI/qjrn/7M+a2hmABWCCZOePHDmyzea2t8+du4tR029jfwBglJyvzh95aou5plSV7nrooZ2Q4EHEOoAgvZXQE1a7gGCEKEFCq5mxnMALWPXDjz56Z1Guz/b/y9xI/+voC7EzIDKQhrvTNtkYT07eDkE5H6WpP9EB3v+k04g+U70v2D8JG7rPoB9vnWl9Cg7eXmTLom7fMLpaotHLci6BdS5M8rlZNQAtBLDJFDjx39/tB+gsUfsqgFc3xRg6bbvOqF21gbzCrq86ivhLM34B5V+nTOiPQP4Rg9XdoRPwdZw85Fwt1E3udCTb4PkJE57QZeLydkW/7PAA50U2LfFONCWeMvc29zy5dNDuGu7WD6HSf29KOSgY3AehzuDS7s36s7YHnT2oS5w6vZnsPCBnDPHNAQW7/IDCnd4uVMkSnUqfTJb1vqrZfgPbXakl3S4Nh7ndgSOLCrytobobqHm3PNXUoQDAxmk2VnPHyOH8UFXnh0cvzCu3cKHEk7Y7sRms0IKtljoCnblrDwUdCNUWbQqy2tXsWKZqhihMs5Em2ThRBh0QHL2shTzE+VFcQm9DqAsnAeytJH8GNubAvR9MI9HEmISOhbVfO2zb/eVoVo7Zg7rEE6nDSO3t7e0rWdN7TwEfLIh/UDr2q8ZTdyYZJpaEAoGnAUDdjVekBS6na6/f5RAWZxhR4JXQmAVZ7qXJ6/vtA5ghAfYfo2uWfNdQHre6NzGHIfXXReqCEYE2TVsav37AD5loRXD0wnkNZSmUDiRGVwU/0pzcgWsWfpgr/alO6dM9GTTHEsyC4LUL0q5E62bsdJShTuuC1y54u25mv+FG/J3jyU6PFxV4G0Hn7F8aX710P2KzK6mGE9cPcOM19hQQjE41w+m6z9bonP0DibXfHKmsLzbskdXtVYpwIEQTlqadOuusvt0SYn9GwrsQBf4dHLMwZ4ymXMQTdfsRhboA+MeG6X13coBz1SAeSpm76LrP0qya6mb2G87KR5Mm5wfWdfk7eR8mG+RKdg7UCJzfAAry6TtdOW8P6jlshbp9w0nhHwG6BlaOTUzvd2iC6EdQ+2dgaV4ZN9bXDOhpROaQ8mkgQJD6UN3h+5D3nA8AdbO69mO/259FeQSgSPp4Wt3hJzQ8Z5gjRUQE/B4AxDv1mYUaGgQsOalB/oS191nS5wH8TOfCYF7fQBKp41UdS6B9EzP6nJ0Q+gmgzwJLLwSAxPW7nB6f7rg60x5No5c1ZiFJ1PQbHydUklKpaCoVr+l7Ynjskvofryl9useVH7KSeiZR07eTWBwvFKRAsPY/xSX0NoDqirJ4bd1roPCzAKAwV4u1ZxPzPCYTbVCa5Lo1g0FmFwI9ou7QYGJGv5sTnUIL4g4vqJ9p6qmb3ufwhM8fqzizBTTOqv903dQBeftmE3iEqiYI/FMmXiygSVDz+6TxGw/NdOauJXUz+t5Pws+q6OWC4N3JTmtH1b8fULxz4AFROo/Vnusr7ciGLqaew1b47917ajywbr2o/BqEbio6XUkHgfw7SDmvXMs6q283Q/YZZuwD6PFK1IcpNaFBOZM1/femVLc3hHggkT+eVK5TMiOSnZf9pLEPMscC+k7ZuCUrdOauJSR0NjdZsabK/N3AZjuAlwCAv6z//vFO9I3ATCZio5ApAjqQiP9pHKcxSLy1wTOJaDuU7biuoSwxvd9tSjyVVB9kjZ9Jii9JtNHOPx7Uk4m4B7E5HdDlYUd7KPzbIXxIcQbeBiDaaUPt7L0uIeBJEnkhFHbOpFGLsu6KleKHqDhqkFoXL9vwHiueJ/AHIDoOts4AQHJ6r/0s8WOk9m8hR65OWnODkrkUIZP/d4Gc4QQKqdoTmfGz0LVL/l03re/rIBraUCXum7lE2IeIh4nxdyChZ6FcCgDJmf0HE+hHQCoWHPt5g23wQwBgVu34iIVElY2nkIvCfT+7K32L0DoJSwcTeKhw4vySa794YmPx50C9cid9/QeAj8NaewKN+WpD7bRBu7KRqVC7O1C//41bPZCIb6p/L7wfGbODUOqexs9aOx8NAEzmOQAIjF70WnxG/6sBvoWQmhTq0rOGLnszzUZC3aHBBNUeAehTDc8SNX0qlPgiIPnj8Nhl/wGA+PQ+pynxcJ0LQyNhYfliMKCUOD885ou76tv13UlIlxZn4G0EcvQLIi4DyX9o1IK1QP1eNDljYGPIUVU+iohJNHgDsTMzNHbJrxTSRa18FBz35Vu1MwfvYjV4BxQlQtghac0HAr4ASF0evubTFjNLNlB3/cDeKnKYiN4fMnbv0LVL/r3+d/13BNGeSvI0AMRr+kwmNj8BsAyauhEWz6jaR4Li3AAAoWsXzYfKvaBARd2MvvOSNTuPbHyfxxzjQzWhKlZEH2tQ3sSsvnvUzhycV0zyUNB5BWJfIg3dGa/p+1L8+oHHNDxLWL5WCDuqcc6msV9tAAAy0g8ACPVxoeNW9ybiElDqaQAg0hNURZXCTwD1V3VC9nwAUMONYW9YE2vr65tHGhS0blbXfvGZAwcBQKpT3RAQ92Kyj9Z/Tjv2F6VKAiaEx9QrLwAoaHdl/YJGwiZmDBpKbIYr/AtKrq1X3g2z+vQSxTEE+WdRgbcRyPJgABD9PrFVPJGMiSQvBAB1hzsAHQgABDs9PGbhn+IzBw4CmYOZ5F4AMDZxOhkzDKpvkSKp5PzOgvqEx3yed6oTRvwgYuM4DnsN++yArxGQ+haBP6ydPGQ7BV0Ba79WwddKeNsxdEjJ2CU/abo/Dq1ffC4IxxL4G6HQfXXTd20MmapK+wG0sGzckhUAsHbykO3Exz0BWZfXtQuNWrA2FA78kJD4uQp1V/Efa9wiiFygkDkl1y5sNHdktReoyoYk6g/MAD5aVayvwTcBQIlPhOrzpaM//QIAkkt6/5bY7EdWFoe+W99oxitw9lWx6wLh0oUNfxPyu91JNrFXfT96DACIKXkFAIhCZwBmQ9DYxs8/OWPg/sRmP7Zm48okcZqqXRv2nX821DG+OZ3YBJnN34tL6G0FTToAoMbWz0g1vUeL8vkaWL0fAKS6LtudxAwltY+Fxn1e71onieOBIMQE6kMfUWApoHAC5vLA6M/eAIDkzIHD6qb3/TM59qbw6GXZAQkyEXOcQucHR382T28a2ilZu362gn/BhNNLxny2Ut2hwUSA64jlX+GxSy4B6g984jW9o6TcIzRuyZVAw6nsZ0/FZ+y6OxA4ylCq8a5VmQIQtUD9KiNRF/+XKM8PjF2Rd1YHGrUgAeCBupp+h0PNzuHO4W/X1wzoCUIfhjaeRsdn9DtBwZey2DEl4z5bCQCkPEJVP+w0vv6/IeiCjZFV4zX9rxToJLayWFkNujYNWmgCAAlWbvDVBcc7L76PLDmh8cseAgARPZbILghf89lnAKDK+4Hky4bTb509KJSo83+vjI9DAX8OAKg1JzPrK01//BRyMSy/Fhy/+N2iAm8jhHx+I6GyzPiBe+pm9F2lMPsT7CXha9YsBgCxcgyIYNmPNLRRDZxIBKhPSwGAGJ+Kb5NW6Z910/u+CUI/Ed2TgBeS8U55KYcoHwyVRF1Nv1nxDRt+SUpxGD0+NGbREwBA3ofJupr+r4HMLxPT+gyAYYoDB0GhRHS2Kqiupv99zNgRKkNUqAsZuTI45qvvo42Q/yAZvjM+ve/ziXhqKDGthZif5yNf3fUDe7P1b1WgRAn7APCZ5EK64sP1OnsQJxKpbwD8ovb6XT4wMEeJxRQm/7bQuKXXA4BO271znOL7gPSZRnGY7weovK6m7xoQdTHqny1k9lHQVXDCAQD1J/5IPkIcGhMv5eeI+u4EpS7s1Adn0Jody+KgIwj6fSI1xWJiPqtuRr8LSeyX8XhqChH6GuMMp9GL63RKn+5xwr6kOqWhSWLGoKEK+QGx/1ugaMixzUCjP/yWHT5FjL6F/9fY1etCFAbRc+b+rqDwBlsgOgqJRqIhnsALUKitmxUKWYlGLUoUCi0SopGtSKgUki0ISzYiCsmKv937zSjW3tCZejLdJDNzzpzj+GDAaJxUM3M4wok5t99RqGW0RoHmzLSSy18/AkA4d3MFnxMwLYuwU8xOAZ2M3qpj3YuVf7GNSFRE8ARYr0DWohB98U/ztsOBMzC3CqGp6QvhLaSRn4+S2wMS5rF5TtOU4m0geBmIC9U/7pK5pdcdUGcNUIhufjXj4Y7i9b8eR+J6+myilwQ+RL3llGF/lNztAa3RGuKKBg6JRWfqpCTQUjh/P50VeK87GuqEZbtt1NWzQmskUJRh6XiYPOzSa5yRbqN9jwCAXFIrkzYl0FfSjkAOhoW7lo6ZHweENQictPPVD9YN7oKQbUhwTOIdvj+S4cqfzS+BbtGTX6KQ1mfmmuYFhwDwDUhUY0v6QIhUAAAAAElFTkSuQmCC', // Chemin vers votre image
                width: 150,
                height: 75,
                margin: [10, 10, 0, 0]
              },
              {
                text: 'Etudes Conseil Formation'
              }
            ]
          ]
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 80]
        }
      },
      footer: [
        {
          margin: [20, 0, 0, 10],
          table: {
            widths: [550],
            heights: [8],
            body: [
              [
                {
                  text: 'www.galaxysolutions.ma',
                  fontSize: 14,
                  color: '#FFF',
                  fillColor: '#FF5E0E',
                  bold: true,
                  alignment: 'center',
                  margin: [0, 5, 0, 0]
                }
              ],
              [
                {
                  text: "Galaxy Solutions SARL, Bureau d'études, Conseil et formation",
                  fontSize: 10,
                  color: '#FFF',
                  alignment: 'center',
                  fillColor: '#808080'
                }
              ],
              [
                {
                  text: 'Bd Zerktouni Res Kamal Parc Center Imm B Etg 2 Bureau N° 08 MOHAMMEDIA',
                  fontSize: 10,
                  color: '#FFF',
                  alignment: 'center',
                  fillColor: '#808080'
                }
              ],
              [
                {
                  text: 'Compte N°: 0111100000012100001038207 BANK OF AFRICA',
                  fontSize: 10,
                  color: '#FFF',
                  alignment: 'center',
                  fillColor: '#808080'
                }
              ],
              [
                {
                  text: 'IF: 14405562 RC: 32589 TP: 39581102 CNSS: 9301201 ICE: 000216179000045',
                  fontSize: 10,
                  color: '#FFF',
                  alignment: 'center',
                  fillColor: '#808080'
                }
              ],
              [
                {
                  text: 'GSM: 0661 16 07 06 Email: Contact@galaxysolutions.ma',
                  fontSize: 10,
                  color: '#FFF',
                  alignment: 'center',
                  fillColor: '#808080'
                }
              ]
            ]
          },
          layout: {
            defaultBorder: false
          }
        }
      ],
      content: [
        {
          margin: [0, 120, 0, 0],
          columns: [
            [
              {
                text: [
                  {text: "Client : ", fontSize: 15},
                  {text: `${client?.corporateName}`, bold: true, fontSize: 15}
                ]
              },
              {
                text: [
                  {text: "ICE : ", fontSize: 15},
                  {text: `${client?.commonCompanyIdentifier}`, bold: true, fontSize: 15}
                ]
              },
              {
                text: [
                  {text: "Adresse : ", fontSize: 15},
                  {text: `${client?.address}`, bold: true, fontSize: 15}
                ]
              }
            ],
            [
              {
                text: [
                  {text: "Facture N° : ", fontSize: 15},
                  {text: `${reference}`, bold: true, fontSize: 15}
                ]
              },
              {
                text: [
                  {text: "Date : ", fontSize: 15},
                  {text: `${formattedDate}`, bold: true, fontSize: 15}
                ]
              }
            ]
          ]
        },
        {
          margin: [0, 60, 0, 0],
          table: {
            headerRows: 1,
            widths: ['auto', '*', '*', '*'],
            body: [
              [
                {text: 'Désignation', bold: true, style: 'tableHeader'},
                {text: 'Quantité', bold: true, style: 'tableHeader'},
                {text: 'Prix Unitaire', bold: true, style: 'tableHeader'},
                {text: 'Total', bold: true, style: 'tableHeader'}
              ],
              ...productRows,
              [
                {text: 'Total HT', alignment: 'right', colSpan: 3},
                {},
                {},
                {text: totalAmount}
              ],
              [
                {text: 'TVA 20%', alignment: 'right', colSpan: 3},
                {},
                {},
                {text: totalAmount * 0.2}
              ],
              [
                {text: 'Total TTC', alignment: 'right', colSpan: 3},
                {},
                {},
                {
                  text: totalAmount + totalAmount * 0.2,
                  fillColor: '#FF5E0E',
                  color: '#FFF'
                }
              ]
            ]
          }
        },
        {
          margin: [15, 10, 0, 50],
          columns: [
            {
              text: [
                {text: `Arrêtée la présente facture à la somme de `},
                {text: `${totalAmountInWords} `, bold: true, italics: true},
                "Dirhams"
              ]
            },
          ],
        },
        {
          margin: [15, 0, 150, 50],
          columns: [
            {
              text: [
                {text: "Échéance : ", bold: true, decoration: "underline"},
                "Conformément à nos accords, le délai de paiement pour cette facture est de ",
                {text: `${client?.deadline}`, bold: true},
                " jours à compter de la date d'émission."
              ],
              margin: [0, 0, 0, 10] // Ajouter une marge basse pour créer un espacement entre les lignes
            }
          ]
        },
        {
          text: 'Yassine DAOUD',
          bold: true,
          alignment: 'right',
          margin: [0, 0, 60, 10]
        },
        {
          text: 'Directeur Général',
          bold: true,
          alignment: 'right',
          margin: [0, 0, 50, 0]
        }
      ]
    };

    pdfMake.createPdf(docDefinition).open();
  }

  /************************************************************************/

  /************************************************************************/
  public generateStandardInvoicePDF(productList: any[], client: ClientModel | undefined, reference: string) {
    return new Promise((resolve) => {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const date = new Date();
      const formattedDate = `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
      // const billNum = `${year.toString().substring(2, 4)}0${month}-001`;

      let totalAmount = 0;

      // Création des lignes de la table des formations
      let productRows = productList.map((product) => {
        // const datesText = product.trainingDates.map((date: string) => '- ' + this.formatDate(date)).join('\n');
        product.total = product.unitPrice * product.quantity
        totalAmount += product.total;
        return [
          {text: product.name},
          {text: product.quantity},
          {text: product.unitPrice},
          {text: product.total}
        ];
      });

      // Convertir le montant total en toutes lettres en français
      const totalAmountWithTax = totalAmount + totalAmount * 0.2;
      const totalAmountInWords = n2words(totalAmountWithTax, {lang: 'fr'});

      // Définir un caractère invisible
      const invisibleSpace = '\u200B'; // espace zéro largeur

// Utiliser le caractère invisible avant la variable
      const textWithSpace = `${invisibleSpace} ${totalAmountInWords}`;
      const textWithSpaces = `${invisibleSpace}`;


      const docDefinition: any = {
        info: {
          title: `bill-${year.toString().substring(2, 4)}0${month}-001`,
          author: 'babaprince',
          subject: 'Bill',
          keyword: 'bill'
        },
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 120],
        watermark: {
          text: 'GALAXY SOLUTIONS',
          color: '#fa8e71',
          opacity: 0.1,
          bold: true,
          italic: false
        },
        header: [
          {
            margin: [40, 10, 40, 10],
            columns: [
              [
                {
                  image: 'data:image/png;base64,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', // Chemin vers votre image
                  width: 150,
                  height: 75,
                  margin: [10, 10, 0, 0]
                },
                {
                  text: 'Etudes Conseil Formation'
                }
              ]
            ]
          }
        ],
        styles: {
          sectionHeader: {
            bold: true,
            decoration: 'underline',
            fontSize: 14,
            margin: [0, 15, 0, 80]
          }
        },
        footer: [
          {
            margin: [20, 0, 0, 10],
            table: {
              widths: [550],
              heights: [8],
              body: [
                [
                  {
                    text: 'www.galaxysolutions.ma',
                    fontSize: 14,
                    color: '#FFF',
                    fillColor: '#FF5E0E',
                    bold: true,
                    alignment: 'center',
                    margin: [0, 5, 0, 0]
                  }
                ],
                [
                  {
                    text: "Galaxy Solutions SARL, Bureau d'études, Conseil et formation",
                    fontSize: 10,
                    color: '#FFF',
                    alignment: 'center',
                    fillColor: '#808080'
                  }
                ],
                [
                  {
                    text: 'Bd Zerktouni Res Kamal Parc Center Imm B Etg 2 Bureau N° 08 MOHAMMEDIA',
                    fontSize: 10,
                    color: '#FFF',
                    alignment: 'center',
                    fillColor: '#808080'
                  }
                ],
                [
                  {
                    text: 'Compte N°: 0111100000012100001038207 BANK OF AFRICA',
                    fontSize: 10,
                    color: '#FFF',
                    alignment: 'center',
                    fillColor: '#808080'
                  }
                ],
                [
                  {
                    text: 'IF: 14405562 RC: 32589 TP: 39581102 CNSS: 9301201 ICE: 000216179000045',
                    fontSize: 10,
                    color: '#FFF',
                    alignment: 'center',
                    fillColor: '#808080'
                  }
                ],
                [
                  {
                    text: 'GSM: 0661 16 07 06 Email: Contact@galaxysolutions.ma',
                    fontSize: 10,
                    color: '#FFF',
                    alignment: 'center',
                    fillColor: '#808080'
                  }
                ]
              ]
            },
            layout: {
              defaultBorder: false
            }
          }
        ],
        content: [
          {
            margin: [0, 120, 0, 0],
            columns: [
              [
                {
                  text: [
                    {text: "Client : ", fontSize: 15},
                    {text: `${client?.corporateName}`, bold: true, fontSize: 15}
                  ]
                },
                {
                  text: [
                    {text: "ICE : ", fontSize: 15},
                    {text: `${client?.commonCompanyIdentifier}`, bold: true, fontSize: 15}
                  ]
                },
                {
                  text: [
                    {text: "Adresse : ", fontSize: 15},
                    {text: `${client?.address}`, bold: true, fontSize: 15}
                  ]
                }
              ],
              [
                {
                  text: [
                    {text: "Facture N° : ", fontSize: 15},
                    {text: `${reference}`, bold: true, fontSize: 15}
                  ]
                },
                {
                  text: [
                    {text: "Date : ", fontSize: 15},
                    {text: `${formattedDate}`, bold: true, fontSize: 15}
                  ]
                }
              ]
            ]
          },
          {
            margin: [0, 60, 0, 0],
            table: {
              headerRows: 1,
              widths: ['auto', '*', '*', '*'],
              body: [
                [
                  {text: 'Désignation', bold: true, style: 'tableHeader'},
                  {text: 'Quantité', bold: true, style: 'tableHeader'},
                  {text: 'Prix Unitaire', bold: true, style: 'tableHeader'},
                  {text: 'Total', bold: true, style: 'tableHeader'}
                ],
                ...productRows,
                [
                  {text: 'Total HT', alignment: 'right', colSpan: 3},
                  {},
                  {},
                  {text: totalAmount}
                ],
                [
                  {text: 'TVA 20%', alignment: 'right', colSpan: 3},
                  {},
                  {},
                  {text: totalAmount * 0.2}
                ],
                [
                  {text: 'Total TTC', alignment: 'right', colSpan: 3},
                  {},
                  {},
                  {
                    text: totalAmount + totalAmount * 0.2,
                    fillColor: '#FF5E0E',
                    color: '#FFF'
                  }
                ]
              ]
            }
          },
          {
            margin: [15, 10, 0, 50],
            columns: [
              {
                text: [
                  {text: `Arrêtée la présente facture à la somme de `},
                  {text: `${totalAmountInWords} `, bold: true, italics: true},
                  "Dirhams"
                ]
              },
            ],
          },
          {
            margin: [15, 0, 150, 50],
            columns: [
              {
                text: [
                  {text: "Échéance : ", bold: true, decoration: "underline"},
                  "Conformément à nos accords, le délai de paiement pour cette facture est de ",
                  {text: `${client?.deadline}`, bold: true},
                  " jours à compter de la date d'émission."
                ],
                margin: [0, 0, 0, 10] // Ajouter une marge basse pour créer un espacement entre les lignes
              }
            ]
          },
          {
            text: 'Yassine DAOUD',
            bold: true,
            alignment: 'right',
            margin: [0, 0, 60, 10]
          },
          {
            text: 'Directeur Général',
            bold: true,
            alignment: 'right',
            margin: [0, 0, 50, 0]
          }
        ]
      };

      const pdfDocGenerator = pdfMake.createPdf(docDefinition);

      pdfDocGenerator.getBlob((blob) => {
        resolve(blob);
      });
    })
  }

  /********************************************************************************/

  /************************************************************************/
  public generateGroupsInvoicePDF(invoiceNumber: string, trainingList: TrainingModel[], client: ClientModel) {
    return new Promise((resolve) => {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const date = new Date();
      const formattedDate = `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;

      let totalAmount = 0;


      // Création des lignes de la table des formations
      let trainingRows = trainingList.map((training) => {
        // Formatage des groupes pour chaque formation
        let groupText = training.groups.map((group, idx) => {
          let lastGroupDate = group.groupDates.map((date) => {
            return this.formatDateToDDMMYYYY(date);  // Utilisez this.formatDate si nécessaire
          }).pop();// Récupérer la dernière date

          // Retourner le texte formaté pour ce groupe
          return `GROUPE ${idx + 1} : Le ${lastGroupDate}`;
        }).join('\n');  // Utiliser un saut de ligne pour chaque groupe
        const datesText = training.trainingDates.map((date: string) => '- ' + this.formatDate(date)).join('\n');
        totalAmount += training.amount;
        return [
          {text: training.theme},
          {text: groupText},
          {text: training.staff},
          {text: training.amount}
        ];
      });

      // Convertir le montant total en toutes lettres en français
      const totalAmountWithTax = totalAmount + totalAmount * 0.2;
      const totalAmountInWords = n2words(totalAmountWithTax, {lang: 'fr'});

      // Définir un caractère invisible
      const invisibleSpace = '\u200B'; // espace zéro largeur

// Utiliser le caractère invisible avant la variable
      const textWithSpace = `${invisibleSpace} ${totalAmountInWords}`;


      const docDefinition: any = {
        info: {
          title: `bill-${year.toString().substring(2, 4)}0${month}-001`,
          author: 'babaprince',
          subject: 'Bill',
          keyword: 'bill'
        },
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 120],
        watermark: {
          text: 'GALAXY SOLUTIONS',
          color: '#9CCDC1',
          opacity: 0.1,
          bold: true,
          italic: false
        },
        header: [
          {
            margin: [40, 10, 40, 10],
            columns: [
              [
                {
                  image: 'data:image/png;base64,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', // Chemin vers votre image
                  width: 150,
                  height: 75,
                  margin: [10, 10, 0, 0]
                },
                {
                  text: 'Etudes Conseil Formation'
                }
              ]
            ]
          }
        ],
        styles: {
          sectionHeader: {
            bold: true,
            decoration: 'underline',
            fontSize: 14,
            margin: [0, 15, 0, 80]
          }
        },
        footer: [
          {
            margin: [20, 0, 0, 10],
            table: {
              widths: [550],
              heights: [8],
              body: [
                [
                  {
                    text: 'www.galaxysolutions.ma',
                    fontSize: 14,
                    color: '#FFF',
                    fillColor: '#FF5E0E',
                    bold: true,
                    alignment: 'center',
                    margin: [0, 5, 0, 0]
                  }
                ],
                [
                  {
                    text: "Galaxy Solutions SARL, Bureau d'études, Conseil et formation",
                    fontSize: 10,
                    color: '#FFF',
                    alignment: 'center',
                    fillColor: '#808080'
                  }
                ],
                [
                  {
                    text: 'Bd Zerktouni Res Kamal Parc Center Imm B Etg 2 Bureau N° 08 MOHAMMEDIA',
                    fontSize: 10,
                    color: '#FFF',
                    alignment: 'center',
                    fillColor: '#808080'
                  }
                ],
                [
                  {
                    text: 'Compte N°: 0111100000012100001038207 BANK OF AFRICA',
                    fontSize: 10,
                    color: '#FFF',
                    alignment: 'center',
                    fillColor: '#808080'
                  }
                ],
                [
                  {
                    text: 'IF: 14405562 RC: 32589 TP: 39581102 CNSS: 9301201 ICE: 000216179000045',
                    fontSize: 10,
                    color: '#FFF',
                    alignment: 'center',
                    fillColor: '#808080'
                  }
                ],
                [
                  {
                    text: 'GSM: 0661 16 07 06 Email: Contact@galaxysolutions.ma',
                    fontSize: 10,
                    color: '#FFF',
                    alignment: 'center',
                    fillColor: '#808080'
                  }
                ]
              ]
            },
            layout: {
              defaultBorder: false
            }
          }
        ],
        content: [
          {
            margin: [0, 120, 0, 0],
            table: {
              headerRows: 1,
              widths: ['auto', '*', '*'],
              body: [
                [
                  {text: 'Entreprise', bold: true, style: 'tableHeader'},
                  {text: 'Facture N° : ', bold: true, style: 'tableHeader'},
                  {text: 'Date :  ', bold: true, style: 'tableHeader'}
                ],
                [
                  [
                    {text: client.corporateName, bold: true},
                    {text: client.address},
                    {text: `ICE : ${client.commonCompanyIdentifier}`}
                  ],
                  {text: invoiceNumber, bold: true, alignment: 'center'},
                  {text: formattedDate, bold: true, alignment: 'center'}
                ],
                [
                  {text: 'Lieu de formation'},
                  {text: trainingList.map(training => training.location).join('\n'), colSpan: 2}
                ]
              ]
            }
          },
          {
            table: {
              widths: ['*', 200, '*', '*'],
              body: [
                [
                  {text: 'Thème', border: [true, false, true, true]},
                  {text: 'Jours réels de formation', border: [true, false, true, true]},
                  {text: 'Nombre de bénéficiaires', border: [true, false, true, true]},
                  {text: 'Montant HT', border: [true, false, true, true]}
                ],
                ...trainingRows,  // Insertion des lignes de formation dynamiquement
                [
                  {text: 'Total HT', alignment: 'right', colSpan: 3},
                  {},
                  {},
                  {text: totalAmount}
                ],
                [
                  {text: 'TVA 20%', alignment: 'right', colSpan: 3},
                  {},
                  {},
                  {text: totalAmount * 0.2}
                ],
                [
                  {text: 'Total TTC', alignment: 'right', colSpan: 3},
                  {},
                  {},
                  {
                    text: totalAmount + totalAmount * 0.2,
                    fillColor: '#FF5E0E',
                    color: '#FFF'
                  }
                ]
              ]
            }
          },
          {
            margin: [15, 10, 0, 50],
            columns: [
              {
                text: `Arrêtée la présente facture de formation à la somme de`,
                width: 'auto'
              },
              {
                text: `${textWithSpace} dirhams`,
                bold: true,
                italics: true,
                width: '*'
              }
            ]
          },
          {
            text: 'Yassine DAOUD',
            bold: true,
            alignment: 'right',
            margin: [0, 0, 60, 10]
          },
          {
            text: 'Directeur Général',
            bold: true,
            alignment: 'right',
            margin: [0, 0, 50, 0]
          }
        ]
      };

      const pdfDocGenerator = pdfMake.createPdf(docDefinition);

      pdfDocGenerator.getBlob((blob) => {
        resolve(blob);
      });
    })
  }

  /********************************************************************************/

  // HTTP REQUESTS
  public saveStandardInvoice(standardInvoice: StandardInvoice) {
    return this.http.post<InvoiceModel>(`${this.host}/invoice/add/standard`, standardInvoice);
  }

  public saveTrainingInvoice(trainingInvoice: TrainingInvoice) {
    return this.http.post<InvoiceModel>(`${this.host}/invoice/add/training`, trainingInvoice);
  }

  public saveGroupsInvoice(trainingsInvoice: TrainingInvoice) {
    return this.http.post<InvoiceModel>(`${this.host}/invoice/add/group-invoice`, trainingsInvoice);
  }

  public getInvoices() {
    return this.http.get<Array<InvoiceModel>>(`${this.host}/invoice/find/all`);
  }

  public getInvoice(idInvoice: number) {
    return this.http.get<InvoiceModel>(`${this.host}/invoice/find/id/${idInvoice}`);
  }

  public findInvoiceNumber(numberInvoice: string) {
    return this.http.get<boolean>(`${this.host}/invoice/find/number/${numberInvoice}`);
  }

  public findInvoiceByNumber(numberInvoice: string) {
    return this.http.get<InvoiceModel>(`${this.host}/invoice/find/byNumber/${numberInvoice}`);
  }

  public updateStandardInvoice(standardInvoice: StandardInvoice) {
    return this.http.put<InvoiceModel>(`${this.host}/invoice/update/standard/${standardInvoice.idInvoice}`, standardInvoice);
  }

  public updateTrainingInvoice(trainingInvoice: TrainingInvoice) {
    return this.http.put<InvoiceModel>(`${this.host}/invoice/update/training/${trainingInvoice.idInvoice}`, trainingInvoice);
  }

  public deleteInvoice(idInvoice: number) {
    return this.http.delete(`${this.host}/invoice/delete/${idInvoice}`);
  }

  public updateInvoiceStatus(formData: FormData) {
    const headers = new HttpHeaders();
    // Make sure datatype is correct like "multipart/form-data"
    headers.append('Content-Type', 'multipart/form-data');
    return this.http.put<InvoiceModel>(`${this.host}/invoice/update/status`, formData, {headers})
  }

  public getNextInvoiceNumber(year: number, month: number): Observable<string> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());
    return this.http.get<{
      invoiceNumber: string
    }>(`${this.host}/invoice/nextInvoiceNumber`, {params}).pipe(map(response => response.invoiceNumber)); // Extraire le numéro de facture de la réponse;
  }


  public updateGroupsInvoice(trainingsInvoice: TrainingInvoice, idInvoice : number) {
    return this.http.put<InvoiceModel>(`${this.host}/invoice/update/group-invoice/${idInvoice}`, trainingsInvoice);
  }
}
