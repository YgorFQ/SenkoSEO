// @ts-nocheck
SenkoLib.registerVariant('section-41', [
/*@@@@Senko - padrao-p-table-click */
  {
    name: 'padrao-p-table-click',
    html: `<footer>
  
<section class="table-container-custom">
  <h1 class="table-text-custom">ITENS RELACIONADOS</h1><br />
  <table class="table-design-custom">
    <thead class="table-head-custom">
      <tr class="table-tr-custom">
        <th class="table-text-custom table-th-custom" style="background-color: #fb8d00; border-radius: 10px 0 0 0;">SKU
        </th>
        <!--Replicar para adicionar mais COLUNAS-->
        <th class="table-text-custom table-th-custom" style="background-color: #fb8d00; border-radius: 0 10px 0 0;">TÍTULO
        </th>
      </tr>
    </thead>
    <tbody>
      <tr class="table-tr-custom">
        <!-- <td class="table-text-custom table-td-custom-title">SKU 1</td> -->
          <td class="table-text-custom table-td-custom-title">
            <a href="#" aria-label="Clique para ir para a página específica do PRODUTO 1">SKU 1</a>
          </td>
        <td class="table-text-custom table-td-custom-sub">DESCRIÇÃO DO PRODUTO 1</td>
       </tr>
      <tr class="table-tr-custom">
        <td class="table-text-custom table-td-custom-title">
            <a href="#" aria-label="Clique para ir para a página específica do PRODUTO 2">SKU 2</a>
          </td>
        <td class="table-text-custom table-td-custom-sub">DESCRIÇÃO DO PRODUTO 2</td>
      </tr>
      <tr class="table-tr-custom">
        <td class="table-text-custom table-td-custom-title">
            <a href="#" aria-label="Clique para ir para a página específica do PRODUTO 3">SKU 3</a>
          </td>
        <td class="table-text-custom table-td-custom-sub">DESCRIÇÃO DO PRODUTO 3</td>
      </tr>
      <tr class="table-tr-custom">
        <td class="table-text-custom table-td-custom-title ">
            <a href="#" aria-label="Clique para ir para a página específica do PRODUTO 4">SKU 4</a>
          </td>
        <td class="table-text-custom table-td-custom-sub">DESCRIÇÃO DO PRODUTO 4</td>
      </tr>
    </tbody>
  </table>
</section>

</footer>`,
    css: `  <style>
  
  .table-container-custom {

    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    display: block;
  }

  .table-design-custom {

    width: 100%;
    border-collapse: collapse;
    margin: 0 auto;
  }

  .table-head-custom {
    color: rgb(255, 255, 255);
    border-radius: 10px;

  }

  .table-text-custom {

    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #979797;
    font-family: sans-serif;
  }

  

  .table-row-custom:hover {

    background-color: #f1f1f1;
    filter: brightness(0.9);
  }

  td a {
    color: #000;
    font-weight: 600;
    text-decoration: none;

  }

  td a:hover {
     color: #e74011;
  }

  .table-th-custom {

    font-weight: bold;
  }

  .table-td-custom {
    color: #555;
  }

  /* Efeito de zebrado nas linhas */

  .table-tr-custom:nth-child(even) {

    background-color: #f1f1f1;
  }

  /* Responsividade */

  @media (max-width: 600px) {

    .table-container-custom {

      padding: 10px;
    }

    .table-text-custom,
    .table-th-custom,
    .table-td-custom {

      padding: 8px;
    }
  }

  </style>`,
  },
]);
