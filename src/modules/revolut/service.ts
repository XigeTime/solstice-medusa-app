import { AbstractPaymentProvider } from "@medusajs/framework/utils"
import {
    Logger,
    PaymentProviderError,
    PaymentProviderSessionResponse,
} from "@medusajs/framework/types"

type InjectedDependencies = {
    logger: Logger
}

type Options = {
    apiKey: string
}

class RevolutPayProviderService extends AbstractPaymentProvider<
    Options
> {
    static identifier = "my-payment"
    protected logger_: Logger
    protected options_: Options

    constructor(
        { logger }: InjectedDependencies,
        options: Options
    ) {
        // @ts-ignore
        super(...arguments)

        this.logger_ = logger
        this.options_ = options
    }

    async initiatePayment(
        context: CreatePaymentProviderSession
    ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
        const {
            amount,
            currency_code,
            context: customerDetails
        } = context

        try {
            const response = await this.client.init(
                amount, currency_code, customerDetails
            )

            return {
                ...response,
                data: {
                    id: response.id
                }
            }
        } catch (e) {
            return {
                error: e,
                code: "unknown",
                detail: e
            }
        }
    }


    async capturePayment(
        paymentData: Record<string, unknown>
    ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
        const externalId = paymentData.id

        try {
            const newData = await this.client.capturePayment(externalId)

            return {
                ...newData,
                id: externalId
            }
        } catch (e) {
            return {
                error: e,
                code: "unknown",
                detail: e
            }
        }
    }

}

export default RevolutPayProviderService