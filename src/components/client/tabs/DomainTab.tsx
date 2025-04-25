"use client";

import type React from "react";
import { useState } from "react";
import { Globe, Info, Mail } from "lucide-react";
import type { UserData } from "@/types";

interface DomainTabProps {
  userData: UserData;
  domainInfo: { name: string; isCustom: boolean };
  updateDomainInfo: (
    domainName: string,
    isCustom: boolean,
    provider?: string
  ) => Promise<void>;
  showConfirmModal: (
    title: string,
    message: string,
    onConfirm: () => void,
    type?: "warning" | "info" | "success" | "danger"
  ) => void;
}

// Helper function to safely convert questionnaireAnswers values to string
const getStringValue = (value: any): string => {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  // For complex types, return a meaningful string or empty
  if (typeof value === "object") {
    return "[Complex Value]";
  }

  return String(value);
};

export const DomainTab: React.FC<DomainTabProps> = ({
  userData,
  domainInfo,
  updateDomainInfo,
  showConfirmModal,
}) => {
  const [activeTab, setActiveTab] = useState<"free" | "custom">(
    domainInfo.isCustom ? "custom" : "free"
  );

  // Safely get provider as string
  const domainProvider = userData.questionnaireAnswers?.domainProvider
    ? getStringValue(userData.questionnaireAnswers.domainProvider)
    : "";

  // Safely get other domain-related values
  const hasDomain = userData.questionnaireAnswers?.hasDomain
    ? getStringValue(userData.questionnaireAnswers.hasDomain)
    : "";

  const domainName = userData.questionnaireAnswers?.domainName
    ? getStringValue(userData.questionnaireAnswers.domainName)
    : "";

  const domainOption = userData.questionnaireAnswers?.domainOption
    ? getStringValue(userData.questionnaireAnswers.domainOption)
    : "";

  const customDomainName = userData.questionnaireAnswers?.customDomainName
    ? getStringValue(userData.questionnaireAnswers.customDomainName)
    : "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Globe className="h-5 w-5 mr-2 text-blue-600" />
          Domain Management
        </h2>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Client Contact Information
        </h3>

        <div className="flex items-center bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="bg-blue-100 rounded-full p-2 mr-4">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-800">
              {userData.email}
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              {userData.firstName && userData.lastName && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                  {userData.firstName} {userData.lastName}
                </span>
              )}
              {userData.phoneNumber && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                  {userData.phoneNumber}
                </span>
              )}
              {userData.questionnaireAnswers?.businessName && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                  {getStringValue(userData.questionnaireAnswers.businessName)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Current Domain Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Current Domain
        </h3>

        {domainInfo.name ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-2 mr-4">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    {domainInfo.name}
                  </p>
                  <div className="flex items-center mt-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        domainInfo.isCustom
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "bg-green-100 text-green-700 border border-green-200"
                      }`}
                    >
                      {domainInfo.isCustom
                        ? "Client's Own Domain"
                        : "Free Domain (Included)"}
                    </span>

                    {domainProvider && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                        Provider: {domainProvider}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  showConfirmModal(
                    "Remove Domain",
                    "Are you sure you want to remove this domain? This action cannot be undone.",
                    () => updateDomainInfo("", false),
                    "danger"
                  );
                }}
                className="bg-white hover:bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 cursor-pointer"
              >
                Remove
              </button>
            </div>

            {/* Domain provider info */}
            {domainInfo.isCustom && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-md font-medium text-gray-700 mb-3">
                  Domain Provider
                </h4>

                <div className="flex">
                  <input
                    type="text"
                    id="domain-provider"
                    placeholder="Enter domain provider (e.g., GoDaddy, Namecheap)"
                    defaultValue={domainProvider}
                    className="flex-1 bg-white border border-gray-300 rounded-l-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById(
                        "domain-provider"
                      ) as HTMLInputElement;
                      const provider = input.value.trim();
                      updateDomainInfo(
                        domainInfo.name,
                        domainInfo.isCustom,
                        provider
                      );
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors duration-200 cursor-pointer"
                  >
                    Update Provider
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Enter the company where the client's domain is registered.
                  This helps with DNS configuration later.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <Globe className="h-16 w-16 text-gray-400 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-gray-700 mb-1">
              No Domain Set
            </h4>
            <p className="text-sm text-gray-500 mb-4">
              This client does not have a domain set up yet.
            </p>
          </div>
        )}
      </div>

      {/* Questionnaire Domain Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Questionnaire Domain Information
        </h3>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          {hasDomain ? (
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="font-medium text-gray-700 w-32">
                  Has Domain:
                </div>
                <div className="text-gray-800">{hasDomain}</div>
              </div>

              {hasDomain === "Yes" && (
                <>
                  <div className="flex items-center">
                    <div className="font-medium text-gray-700 w-32">
                      Domain Name:
                    </div>
                    <div className="text-gray-800">
                      {domainName || "Not specified"}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="font-medium text-gray-700 w-32">
                      Domain Provider:
                    </div>
                    <div className="text-gray-800">
                      {domainProvider || "Not specified"}
                    </div>
                  </div>
                </>
              )}

              {hasDomain === "No" && (
                <>
                  <div className="flex items-center">
                    <div className="font-medium text-gray-700 w-32">
                      Domain Option:
                    </div>
                    <div className="text-gray-800">
                      {domainOption || "Not specified"}
                    </div>
                  </div>

                  {domainOption === "customDomain" && (
                    <div className="flex items-center">
                      <div className="font-medium text-gray-700 w-32">
                        Custom Domain:
                      </div>
                      <div className="text-gray-800">
                        {customDomainName || "Not specified"}
                      </div>
                    </div>
                  )}

                  {domainOption?.startsWith("domain:") && (
                    <div className="flex items-center">
                      <div className="font-medium text-gray-700 w-32">
                        Selected Domain:
                      </div>
                      <div className="text-gray-800">
                        {domainOption.replace("domain:", "")}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="text-gray-500 italic">
              No domain information provided in questionnaire
            </div>
          )}
        </div>
      </div>

      {/* Add/Update Domain */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          {domainInfo.name ? "Update Domain" : "Add Domain"}
        </h3>

        <div className="space-y-6">
          {/* Domain Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "free"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("free")}
            >
              Included Free Domain
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "custom"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("custom")}
            >
              Client's Own Domain
            </button>
          </div>

          {/* Free Domain Content */}
          {activeTab === "free" && (
            <div className="space-y-4">
              <div className="mb-4">
                <label
                  htmlFor="free-domain"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Domain Name
                </label>
                <input
                  type="text"
                  id="free-domain"
                  placeholder="Enter domain name (e.g., example.com)"
                  defaultValue={!domainInfo.isCustom ? domainInfo.name : ""}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Enter the domain name that was selected from our domain
                  registration tool.
                </p>
              </div>

              <button
                onClick={() => {
                  const input = document.getElementById(
                    "free-domain"
                  ) as HTMLInputElement;
                  const domain = input.value.trim();
                  if (domain) {
                    updateDomainInfo(domain, false);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full transition-colors duration-200 cursor-pointer"
              >
                {domainInfo.name && !domainInfo.isCustom
                  ? "Update Domain"
                  : "Add Domain"}
              </button>
            </div>
          )}

          {/* Custom Domain Content */}
          {activeTab === "custom" && (
            <div className="space-y-4">
              <div className="mb-4">
                <label
                  htmlFor="custom-domain"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Client's Domain Name
                </label>
                <input
                  type="text"
                  id="custom-domain"
                  placeholder="Enter client's domain (e.g., example.com)"
                  defaultValue={domainInfo.isCustom ? domainInfo.name : ""}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Enter the domain name that the client already owns.
                </p>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="domain-provider-input"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Domain Provider
                </label>
                <input
                  type="text"
                  id="domain-provider-input"
                  placeholder="Enter domain provider (e.g., GoDaddy, Namecheap)"
                  defaultValue={domainProvider}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Enter the company where the client's domain is registered.
                </p>
              </div>

              <button
                onClick={() => {
                  const domainInput = document.getElementById(
                    "custom-domain"
                  ) as HTMLInputElement;
                  const providerInput = document.getElementById(
                    "domain-provider-input"
                  ) as HTMLInputElement;
                  const domain = domainInput.value.trim();
                  const provider = providerInput.value.trim();

                  if (domain) {
                    updateDomainInfo(domain, true, provider);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full transition-colors duration-200 cursor-pointer"
              >
                {domainInfo.name && domainInfo.isCustom
                  ? "Update Domain"
                  : "Add Domain"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Domain Management Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-blue-700 font-medium mb-1">
              Domain Management Tips
            </h4>
            <ul className="text-sm text-blue-600 space-y-1 list-disc pl-5">
              <li>
                For client-owned domains, you'll need to update the DNS settings
                at their domain provider.
              </li>
              <li>
                Free domains included with plans will need to be configured.
              </li>
              <li>
                Allow 24-48 hours for DNS changes to fully propagate after
                setup.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
