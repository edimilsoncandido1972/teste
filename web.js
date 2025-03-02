import { browser } from "k6/browser";
import { sleep, check } from "k6";

export const options = {
    scenarios: {
        uiFluxoCompra: {
            executor: "constant-vus",
            vus: 1,
            duration: "10s",
            options: {
                browser: {
                    type: "chromium", // Usando o Chromium para o teste
                    // args: ["--disable-extensions", "--disable-background-networking"]
                },
            },
        },
    },
    thresholds: {
        checks: ["rate==1.0"], // Certificando-se de que todas as verificações sejam bem-sucedidas
    },
};

export default async function () {
    const context = await browser.newContext(); // Criando contexto do navegador (precisa ser assíncrono)
    const page = await context.newPage(); // Criando nova página dentro do contexto (precisa ser assíncrono)

    try {
        await page.goto("https://loja.electrolux.com.br/bocal-escova-de-cerdas-metalicas-original-electrolux-para-vaporizador-mop11--bmnvc01-/p"); // Acessando a URL

        // Aguardando o botão "Comprar" aparecer
        await page.locator('button:has-text("Comprar")').waitFor({ state: "visible" });

        // Clicando no botão "Comprar"
        await page.locator('button:has-text("Comprar")').click();

        // Verificando se o título do carrinho está correto
       // check(page, {
       //     "O título do carrinho está correto": (p) =>
       //        p.locator("h1#cart-title").textContent() === "Meu Carrinho", // Validação
       // });

        const button = page.locator('[data-event="cartToOrderform"]');
        await button.click();
        sleep(5);

        await page.waitForSelector('input[name="client-pre-email"]');
        await page.locator('input[name="client-pre-email"]').type('teste@email.com');
        await page.locator('#client-email').type('teste@email.com');
        await page.locator('#client-first-name').type('Jose');
        await page.locator('#client-last-name').type('Silva');
        await page.locator('#client-document').type('17249574817');
        await page.locator('#client-phone').type('11997867037');
        await page.locator('#v-custom-terms__input').click();
        await page.locator('#go-to-shipping').click();

        
        await page.waitForSelector('span.accordion-toggle');
        await page.locator('span.accordion-toggle').click();
        await page.locator('ship-postalCode').type('08220290');
        await page.waitForSelector('input[name="client-pre-email"]');
        await page.locator('#ship-number').type('34');
        await page.locator('button#btn-go-to-payment').click();


       const iframe = await page.frame({ name: 'iframe-placeholder-creditCardPaymentGroup' });


         // Aguarda o carregamento do span "Boleto bancário" dentro do iframe
        await iframe.waitForSelector('span.payment-group-item-text');

        // Localiza o span "Boleto bancário" e clica nele
        const boletoElement = iframe.locator('span.payment-group-item-text');
        await boletoElement.click();





        
        

        sleep(1); // Atraso entre as ações
    } catch (err) {
        console.error("Erro ao executar o teste:", err); // Log de erro em caso de falha
    } finally {
        await page.close(); // Fechando a página
        await context.close(); // Fechando o contexto
    }
}
