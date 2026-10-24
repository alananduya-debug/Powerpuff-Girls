import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { ActivityEntry, HealthStatus, HubUser, InvoiceCommentInput, InvoiceDetail, InvoiceListItem, InvoiceSummary, InvoiceUpdateInput, NotFoundResponse, OcrModeInput, OcrSettings, RevealFieldInput, RevealedField, UploadInvoiceResult } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: Parameters<typeof customFetch>[1]) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListUsersUrl: () => string;
/**
 * @summary List simulated hub users
 */
export declare const listUsers: (options?: Parameters<typeof customFetch>[1]) => Promise<HubUser[]>;
export declare const getListUsersQueryKey: () => readonly ["/api/users"];
export declare const getListUsersQueryOptions: <TData = Awaited<ReturnType<typeof listUsers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListUsersQueryResult = NonNullable<Awaited<ReturnType<typeof listUsers>>>;
export type ListUsersQueryError = ErrorType<unknown>;
/**
 * @summary List simulated hub users
 */
export declare function useListUsers<TData = Awaited<ReturnType<typeof listUsers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetSummaryUrl: () => string;
/**
 * @summary Get dashboard summary for current role
 */
export declare const getSummary: (options?: Parameters<typeof customFetch>[1]) => Promise<InvoiceSummary>;
export declare const getGetSummaryQueryKey: () => readonly ["/api/summary"];
export declare const getGetSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getSummary>>>;
export type GetSummaryQueryError = ErrorType<unknown>;
/**
 * @summary Get dashboard summary for current role
 */
export declare function useGetSummary<TData = Awaited<ReturnType<typeof getSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetOcrSettingsUrl: () => string;
/**
 * @summary Get OCR mode and live service readiness
 */
export declare const getOcrSettings: (options?: Parameters<typeof customFetch>[1]) => Promise<OcrSettings>;
export declare const getGetOcrSettingsQueryKey: () => readonly ["/api/settings/ocr"];
export declare const getGetOcrSettingsQueryOptions: <TData = Awaited<ReturnType<typeof getOcrSettings>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOcrSettings>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getOcrSettings>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetOcrSettingsQueryResult = NonNullable<Awaited<ReturnType<typeof getOcrSettings>>>;
export type GetOcrSettingsQueryError = ErrorType<unknown>;
/**
 * @summary Get OCR mode and live service readiness
 */
export declare function useGetOcrSettings<TData = Awaited<ReturnType<typeof getOcrSettings>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOcrSettings>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateOcrSettingsUrl: () => string;
/**
 * @summary Change the workspace OCR mode as owner
 */
export declare const updateOcrSettings: (ocrModeInput: OcrModeInput, options?: Parameters<typeof customFetch>[1]) => Promise<OcrSettings>;
export declare const getUpdateOcrSettingsMutationKey: () => readonly ["updateOcrSettings"];
export declare const getUpdateOcrSettingsMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateOcrSettings>>, TError, UpdateOcrSettingsMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateOcrSettings>>, TError, UpdateOcrSettingsMutationVariables, TContext>;
export type UpdateOcrSettingsMutationResult = NonNullable<Awaited<ReturnType<typeof updateOcrSettings>>>;
export type UpdateOcrSettingsMutationBody = BodyType<OcrModeInput>;
export type UpdateOcrSettingsMutationError = ErrorType<void>;
export type UpdateOcrSettingsMutationVariables = {
    data: BodyType<OcrModeInput>;
};
/**
* @summary Change the workspace OCR mode as owner
*/
export declare const useUpdateOcrSettings: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateOcrSettings>>, TError, UpdateOcrSettingsMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateOcrSettings>>, TError, UpdateOcrSettingsMutationVariables, TContext>;
export declare const getListInvoicesUrl: () => string;
/**
 * @summary List invoices with sensitive values masked
 */
export declare const listInvoices: (options?: Parameters<typeof customFetch>[1]) => Promise<InvoiceListItem[]>;
export declare const getListInvoicesQueryKey: () => readonly ["/api/invoices"];
export declare const getListInvoicesQueryOptions: <TData = Awaited<ReturnType<typeof listInvoices>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listInvoices>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listInvoices>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListInvoicesQueryResult = NonNullable<Awaited<ReturnType<typeof listInvoices>>>;
export type ListInvoicesQueryError = ErrorType<unknown>;
/**
 * @summary List invoices with sensitive values masked
 */
export declare function useListInvoices<TData = Awaited<ReturnType<typeof listInvoices>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listInvoices>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUploadInvoiceUrl: () => string;
/**
 * @summary Upload and encrypt an invoice file
 */
export declare const uploadInvoice: (options?: Parameters<typeof customFetch>[1]) => Promise<UploadInvoiceResult>;
export declare const getUploadInvoiceMutationKey: () => readonly ["uploadInvoice"];
export declare const getUploadInvoiceMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof uploadInvoice>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof uploadInvoice>>, TError, void, TContext>;
export type UploadInvoiceMutationResult = NonNullable<Awaited<ReturnType<typeof uploadInvoice>>>;
export type UploadInvoiceMutationError = ErrorType<unknown>;
/**
* @summary Upload and encrypt an invoice file
*/
export declare const useUploadInvoice: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof uploadInvoice>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof uploadInvoice>>, TError, void, TContext>;
export declare const getGetInvoiceUrl: (invoiceId: string) => string;
/**
 * @summary Get invoice details with sensitive fields masked
 */
export declare const getInvoice: (invoiceId: string, options?: Parameters<typeof customFetch>[1]) => Promise<InvoiceDetail>;
export declare const getGetInvoiceQueryKey: (invoiceId: string) => readonly [`/api/invoices/${string}`];
export declare const getGetInvoiceQueryOptions: <TData = Awaited<ReturnType<typeof getInvoice>>, TError = ErrorType<NotFoundResponse>>(invoiceId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getInvoice>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getInvoice>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetInvoiceQueryResult = NonNullable<Awaited<ReturnType<typeof getInvoice>>>;
export type GetInvoiceQueryError = ErrorType<NotFoundResponse>;
/**
 * @summary Get invoice details with sensitive fields masked
 */
export declare function useGetInvoice<TData = Awaited<ReturnType<typeof getInvoice>>, TError = ErrorType<NotFoundResponse>>(invoiceId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getInvoice>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateInvoiceUrl: (invoiceId: string) => string;
/**
 * @summary Update invoice fields
 */
export declare const updateInvoice: (invoiceId: string, invoiceUpdateInput: InvoiceUpdateInput, options?: Parameters<typeof customFetch>[1]) => Promise<InvoiceDetail>;
export declare const getUpdateInvoiceMutationKey: () => readonly ["updateInvoice"];
export declare const getUpdateInvoiceMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateInvoice>>, TError, UpdateInvoiceMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateInvoice>>, TError, UpdateInvoiceMutationVariables, TContext>;
export type UpdateInvoiceMutationResult = NonNullable<Awaited<ReturnType<typeof updateInvoice>>>;
export type UpdateInvoiceMutationBody = BodyType<InvoiceUpdateInput>;
export type UpdateInvoiceMutationError = ErrorType<unknown>;
export type UpdateInvoiceMutationVariables = {
    invoiceId: string;
    data: BodyType<InvoiceUpdateInput>;
};
/**
* @summary Update invoice fields
*/
export declare const useUpdateInvoice: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateInvoice>>, TError, UpdateInvoiceMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateInvoice>>, TError, UpdateInvoiceMutationVariables, TContext>;
export declare const getRevealInvoiceFieldUrl: (invoiceId: string) => string;
/**
 * @summary Reveal one sensitive value to an authorized reviewer
 */
export declare const revealInvoiceField: (invoiceId: string, revealFieldInput: RevealFieldInput, options?: Parameters<typeof customFetch>[1]) => Promise<RevealedField>;
export declare const getRevealInvoiceFieldMutationKey: () => readonly ["revealInvoiceField"];
export declare const getRevealInvoiceFieldMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof revealInvoiceField>>, TError, RevealInvoiceFieldMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof revealInvoiceField>>, TError, RevealInvoiceFieldMutationVariables, TContext>;
export type RevealInvoiceFieldMutationResult = NonNullable<Awaited<ReturnType<typeof revealInvoiceField>>>;
export type RevealInvoiceFieldMutationBody = BodyType<RevealFieldInput>;
export type RevealInvoiceFieldMutationError = ErrorType<void>;
export type RevealInvoiceFieldMutationVariables = {
    invoiceId: string;
    data: BodyType<RevealFieldInput>;
};
/**
* @summary Reveal one sensitive value to an authorized reviewer
*/
export declare const useRevealInvoiceField: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof revealInvoiceField>>, TError, RevealInvoiceFieldMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof revealInvoiceField>>, TError, RevealInvoiceFieldMutationVariables, TContext>;
export declare const getGetInvoiceFileUrl: (invoiceId: string) => string;
/**
 * @summary Stream an authorized invoice file
 */
export declare const getInvoiceFile: (invoiceId: string, options?: Parameters<typeof customFetch>[1]) => Promise<void>;
export declare const getGetInvoiceFileQueryKey: (invoiceId: string) => readonly [`/api/invoices/${string}/file`];
export declare const getGetInvoiceFileQueryOptions: <TData = Awaited<ReturnType<typeof getInvoiceFile>>, TError = ErrorType<NotFoundResponse>>(invoiceId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getInvoiceFile>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getInvoiceFile>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetInvoiceFileQueryResult = NonNullable<Awaited<ReturnType<typeof getInvoiceFile>>>;
export type GetInvoiceFileQueryError = ErrorType<NotFoundResponse>;
/**
 * @summary Stream an authorized invoice file
 */
export declare function useGetInvoiceFile<TData = Awaited<ReturnType<typeof getInvoiceFile>>, TError = ErrorType<NotFoundResponse>>(invoiceId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getInvoiceFile>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getSubmitInvoiceUrl: (invoiceId: string) => string;
/**
 * @summary Submit an invoice for review
 */
export declare const submitInvoice: (invoiceId: string, options?: Parameters<typeof customFetch>[1]) => Promise<InvoiceDetail>;
export declare const getSubmitInvoiceMutationKey: () => readonly ["submitInvoice"];
export declare const getSubmitInvoiceMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitInvoice>>, TError, SubmitInvoiceMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof submitInvoice>>, TError, SubmitInvoiceMutationVariables, TContext>;
export type SubmitInvoiceMutationResult = NonNullable<Awaited<ReturnType<typeof submitInvoice>>>;
export type SubmitInvoiceMutationError = ErrorType<unknown>;
export type SubmitInvoiceMutationVariables = {
    invoiceId: string;
};
/**
* @summary Submit an invoice for review
*/
export declare const useSubmitInvoice: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitInvoice>>, TError, SubmitInvoiceMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof submitInvoice>>, TError, SubmitInvoiceMutationVariables, TContext>;
export declare const getSendBackInvoiceUrl: (invoiceId: string) => string;
/**
 * @summary Send an invoice back to staff
 */
export declare const sendBackInvoice: (invoiceId: string, invoiceCommentInput?: InvoiceCommentInput, options?: Parameters<typeof customFetch>[1]) => Promise<InvoiceDetail>;
export declare const getSendBackInvoiceMutationKey: () => readonly ["sendBackInvoice"];
export declare const getSendBackInvoiceMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendBackInvoice>>, TError, SendBackInvoiceMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof sendBackInvoice>>, TError, SendBackInvoiceMutationVariables, TContext>;
export type SendBackInvoiceMutationResult = NonNullable<Awaited<ReturnType<typeof sendBackInvoice>>>;
export type SendBackInvoiceMutationBody = BodyType<InvoiceCommentInput> | undefined;
export type SendBackInvoiceMutationError = ErrorType<unknown>;
export type SendBackInvoiceMutationVariables = {
    invoiceId: string;
    data?: BodyType<InvoiceCommentInput>;
};
/**
* @summary Send an invoice back to staff
*/
export declare const useSendBackInvoice: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendBackInvoice>>, TError, SendBackInvoiceMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof sendBackInvoice>>, TError, SendBackInvoiceMutationVariables, TContext>;
export declare const getPassInvoiceToOwnerUrl: (invoiceId: string) => string;
/**
 * @summary Pass an invoice to the owner for final approval
 */
export declare const passInvoiceToOwner: (invoiceId: string, invoiceCommentInput?: InvoiceCommentInput, options?: Parameters<typeof customFetch>[1]) => Promise<InvoiceDetail>;
export declare const getPassInvoiceToOwnerMutationKey: () => readonly ["passInvoiceToOwner"];
export declare const getPassInvoiceToOwnerMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof passInvoiceToOwner>>, TError, PassInvoiceToOwnerMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof passInvoiceToOwner>>, TError, PassInvoiceToOwnerMutationVariables, TContext>;
export type PassInvoiceToOwnerMutationResult = NonNullable<Awaited<ReturnType<typeof passInvoiceToOwner>>>;
export type PassInvoiceToOwnerMutationBody = BodyType<InvoiceCommentInput> | undefined;
export type PassInvoiceToOwnerMutationError = ErrorType<unknown>;
export type PassInvoiceToOwnerMutationVariables = {
    invoiceId: string;
    data?: BodyType<InvoiceCommentInput>;
};
/**
* @summary Pass an invoice to the owner for final approval
*/
export declare const usePassInvoiceToOwner: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof passInvoiceToOwner>>, TError, PassInvoiceToOwnerMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof passInvoiceToOwner>>, TError, PassInvoiceToOwnerMutationVariables, TContext>;
export declare const getApproveInvoiceUrl: (invoiceId: string) => string;
/**
 * @summary Approve an invoice as owner
 */
export declare const approveInvoice: (invoiceId: string, options?: Parameters<typeof customFetch>[1]) => Promise<InvoiceDetail>;
export declare const getApproveInvoiceMutationKey: () => readonly ["approveInvoice"];
export declare const getApproveInvoiceMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof approveInvoice>>, TError, ApproveInvoiceMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof approveInvoice>>, TError, ApproveInvoiceMutationVariables, TContext>;
export type ApproveInvoiceMutationResult = NonNullable<Awaited<ReturnType<typeof approveInvoice>>>;
export type ApproveInvoiceMutationError = ErrorType<unknown>;
export type ApproveInvoiceMutationVariables = {
    invoiceId: string;
};
/**
* @summary Approve an invoice as owner
*/
export declare const useApproveInvoice: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof approveInvoice>>, TError, ApproveInvoiceMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof approveInvoice>>, TError, ApproveInvoiceMutationVariables, TContext>;
export declare const getRejectInvoiceUrl: (invoiceId: string) => string;
/**
 * @summary Reject an invoice as owner
 */
export declare const rejectInvoice: (invoiceId: string, invoiceCommentInput?: InvoiceCommentInput, options?: Parameters<typeof customFetch>[1]) => Promise<InvoiceDetail>;
export declare const getRejectInvoiceMutationKey: () => readonly ["rejectInvoice"];
export declare const getRejectInvoiceMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof rejectInvoice>>, TError, RejectInvoiceMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof rejectInvoice>>, TError, RejectInvoiceMutationVariables, TContext>;
export type RejectInvoiceMutationResult = NonNullable<Awaited<ReturnType<typeof rejectInvoice>>>;
export type RejectInvoiceMutationBody = BodyType<InvoiceCommentInput> | undefined;
export type RejectInvoiceMutationError = ErrorType<unknown>;
export type RejectInvoiceMutationVariables = {
    invoiceId: string;
    data?: BodyType<InvoiceCommentInput>;
};
/**
* @summary Reject an invoice as owner
*/
export declare const useRejectInvoice: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof rejectInvoice>>, TError, RejectInvoiceMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof rejectInvoice>>, TError, RejectInvoiceMutationVariables, TContext>;
export declare const getGetInvoiceActivityUrl: (invoiceId: string) => string;
/**
 * @summary Get invoice activity history
 */
export declare const getInvoiceActivity: (invoiceId: string, options?: Parameters<typeof customFetch>[1]) => Promise<ActivityEntry[]>;
export declare const getGetInvoiceActivityQueryKey: (invoiceId: string) => readonly [`/api/invoices/${string}/activity`];
export declare const getGetInvoiceActivityQueryOptions: <TData = Awaited<ReturnType<typeof getInvoiceActivity>>, TError = ErrorType<unknown>>(invoiceId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getInvoiceActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getInvoiceActivity>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetInvoiceActivityQueryResult = NonNullable<Awaited<ReturnType<typeof getInvoiceActivity>>>;
export type GetInvoiceActivityQueryError = ErrorType<unknown>;
/**
 * @summary Get invoice activity history
 */
export declare function useGetInvoiceActivity<TData = Awaited<ReturnType<typeof getInvoiceActivity>>, TError = ErrorType<unknown>>(invoiceId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getInvoiceActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetActivityUrl: () => string;
/**
 * @summary Get recent app activity
 */
export declare const getActivity: (options?: Parameters<typeof customFetch>[1]) => Promise<ActivityEntry[]>;
export declare const getGetActivityQueryKey: () => readonly ["/api/activity"];
export declare const getGetActivityQueryOptions: <TData = Awaited<ReturnType<typeof getActivity>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getActivity>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetActivityQueryResult = NonNullable<Awaited<ReturnType<typeof getActivity>>>;
export type GetActivityQueryError = ErrorType<unknown>;
/**
 * @summary Get recent app activity
 */
export declare function useGetActivity<TData = Awaited<ReturnType<typeof getActivity>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetApprovedRecordsUrl: () => string;
/**
 * @summary Get approved records
 */
export declare const getApprovedRecords: (options?: Parameters<typeof customFetch>[1]) => Promise<InvoiceListItem[]>;
export declare const getGetApprovedRecordsQueryKey: () => readonly ["/api/records"];
export declare const getGetApprovedRecordsQueryOptions: <TData = Awaited<ReturnType<typeof getApprovedRecords>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getApprovedRecords>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getApprovedRecords>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetApprovedRecordsQueryResult = NonNullable<Awaited<ReturnType<typeof getApprovedRecords>>>;
export type GetApprovedRecordsQueryError = ErrorType<unknown>;
/**
 * @summary Get approved records
 */
export declare function useGetApprovedRecords<TData = Awaited<ReturnType<typeof getApprovedRecords>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getApprovedRecords>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getExportRecordsUrl: (format: "csv" | "json") => string;
/**
 * @summary Export approved records as owner
 */
export declare const exportRecords: (format: "csv" | "json", options?: Parameters<typeof customFetch>[1]) => Promise<string>;
export declare const getExportRecordsQueryKey: (format: "csv" | "json") => readonly ["/api/exports/csv" | "/api/exports/json"];
export declare const getExportRecordsQueryOptions: <TData = Awaited<ReturnType<typeof exportRecords>>, TError = ErrorType<void>>(format: "csv" | "json", options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof exportRecords>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof exportRecords>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ExportRecordsQueryResult = NonNullable<Awaited<ReturnType<typeof exportRecords>>>;
export type ExportRecordsQueryError = ErrorType<void>;
/**
 * @summary Export approved records as owner
 */
export declare function useExportRecords<TData = Awaited<ReturnType<typeof exportRecords>>, TError = ErrorType<void>>(format: 'csv' | 'json', options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof exportRecords>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map