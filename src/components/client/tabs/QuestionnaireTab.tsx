/* eslint-disable */
"use client";

import type React from "react";
import {
  FileText,
  Users,
  Globe,
  Palette,
  Database,
  ExternalLink,
} from "lucide-react";
import type { UserData, WebsiteEntry, FileUpload } from "@/types";
import { renderQuestionnaireField } from "@/components/client/utils";
import { parseDomainValue } from "@/components/client/utils";
import { CollapsibleSection } from "@/components/client/CollapsibleSection";
import { getStringValue } from "@/utils/stringHelpers";
import Image from "next/image";

interface QuestionnaireTabProps {
  userData: UserData;
}

export const QuestionnaireTab: React.FC<QuestionnaireTabProps> = ({
  userData,
}) => {
  const domainInfo = parseDomainValue(
    (userData.questionnaireAnswers?.customDomainName ||
      userData.questionnaireAnswers?.domainName) as string
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-600" />
          Questionnaire Answers
        </h2>
      </div>

      {userData?.questionnaireAnswers ? (
        <div className="space-y-6">
          {/* Business Information */}
          <CollapsibleSection
            title="Business Information"
            icon={<Users className="h-5 w-5 text-blue-600" />}
            defaultOpen={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Business Name</p>
                <p className="text-sm font-medium text-gray-800">
                  {renderQuestionnaireField(
                    userData.questionnaireAnswers.businessName
                  )}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Business Tagline</p>
                <p className="text-sm text-gray-800">
                  {renderQuestionnaireField(
                    userData.questionnaireAnswers.businessTagline
                  )}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">
                  Business Description
                </p>
                <p className="text-sm text-gray-800">
                  {renderQuestionnaireField(
                    userData.questionnaireAnswers.businessDescription
                  )}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">
                  Services & Products
                </p>
                <p className="text-sm text-gray-800">
                  {renderQuestionnaireField(
                    userData.questionnaireAnswers.servicesProducts
                  )}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Target Audience</p>
                <p className="text-sm text-gray-800">
                  {renderQuestionnaireField(
                    userData.questionnaireAnswers.targetAudience
                  )}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">
                  Business Unique Selling Points
                </p>
                <p className="text-sm text-gray-800">
                  {renderQuestionnaireField(
                    userData.questionnaireAnswers.businessUnique
                  )}
                </p>
              </div>
            </div>
          </CollapsibleSection>

          {/* Competitors */}
          <CollapsibleSection
            title="Competitors"
            icon={<Globe className="h-5 w-5 text-blue-600" />}
            defaultOpen={true}
          >
            {userData.questionnaireAnswers.competitors &&
            Array.isArray(userData.questionnaireAnswers.competitors) &&
            userData.questionnaireAnswers.competitors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userData.questionnaireAnswers.competitors.map(
                  (competitor: WebsiteEntry, index: number) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg flex items-center"
                    >
                      <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                        <Globe className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {competitor.name}
                        </p>
                        {competitor.url && (
                          <a
                            href={
                              competitor.url.startsWith("http")
                                ? competitor.url
                                : `https://${competitor.url}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center truncate"
                          >
                            {competitor.url}
                            <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                          </a>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">No competitors listed</p>
              </div>
            )}
          </CollapsibleSection>

          {/* Design Information */}
          <CollapsibleSection
            title="Design & Style Preferences"
            icon={<Palette className="h-5 w-5 text-blue-600" />}
            defaultOpen={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Website Style</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {userData.questionnaireAnswers.websiteStyle &&
                  Array.isArray(userData.questionnaireAnswers.websiteStyle) ? (
                    userData.questionnaireAnswers.websiteStyle.map(
                      (style: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200"
                        >
                          {style}
                        </span>
                      )
                    )
                  ) : (
                    <span className="text-sm text-gray-500">Not specified</span>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Color Preferences</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {userData.questionnaireAnswers.colorPreferences &&
                  Array.isArray(
                    userData.questionnaireAnswers.colorPreferences
                  ) ? (
                    userData.questionnaireAnswers.colorPreferences.map(
                      (color: string, index: number) => (
                        <div key={index} className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-1 border border-gray-200"
                            style={{ backgroundColor: color }}
                          ></div>
                          <span className="text-xs text-gray-700">{color}</span>
                        </div>
                      )
                    )
                  ) : (
                    <span className="text-sm text-gray-500">
                      No color preferences specified
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">
                  Desired Website Pages
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {userData.questionnaireAnswers.websitePages &&
                  Array.isArray(userData.questionnaireAnswers.websitePages) ? (
                    userData.questionnaireAnswers.websitePages.map(
                      (page: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border border-gray-200"
                        >
                          {page}
                        </span>
                      )
                    )
                  ) : (
                    <span className="text-sm text-gray-500">
                      No pages specified
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">
                  Desired Visitor Actions
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {userData.questionnaireAnswers.desiredVisitorActions &&
                  Array.isArray(
                    userData.questionnaireAnswers.desiredVisitorActions
                  ) ? (
                    userData.questionnaireAnswers.desiredVisitorActions.map(
                      (action: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border border-gray-200"
                        >
                          {action}
                        </span>
                      )
                    )
                  ) : (
                    <span className="text-sm text-gray-500">
                      No actions specified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Current Website Information */}
          <CollapsibleSection
            title="Current Website Information"
            icon={<Globe className="h-5 w-5 text-blue-600" />}
            defaultOpen={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">
                  Has Current Website
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {renderQuestionnaireField(
                    userData.questionnaireAnswers.hasCurrentWebsite
                  )}
                </p>
              </div>
              {userData.questionnaireAnswers.hasCurrentWebsite === "Yes" && (
                <>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">
                      Current Website URL
                    </p>
                    {userData.questionnaireAnswers.currentWebsiteUrl ? (
                      <a
                        href={
                          getStringValue(
                            userData.questionnaireAnswers.currentWebsiteUrl
                          ).startsWith("http")
                            ? getStringValue(
                                userData.questionnaireAnswers.currentWebsiteUrl
                              )
                            : `https://${getStringValue(
                                userData.questionnaireAnswers.currentWebsiteUrl
                              )}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center text-sm"
                      >
                        {getStringValue(
                          userData.questionnaireAnswers.currentWebsiteUrl
                        )}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    ) : (
                      <p className="text-sm text-gray-500">Not provided</p>
                    )}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Current CMS</p>
                    <p className="text-sm text-gray-800">
                      {renderQuestionnaireField(
                        userData.questionnaireAnswers.currentCms
                      )}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">
                      Current Website Likes
                    </p>
                    <p className="text-sm text-gray-800">
                      {renderQuestionnaireField(
                        userData.questionnaireAnswers.websiteLikes
                      )}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">
                      Current Website Dislikes
                    </p>
                    <p className="text-sm text-gray-800">
                      {renderQuestionnaireField(
                        userData.questionnaireAnswers.websiteDislikes
                      )}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CollapsibleSection>

          {/* Domain Information */}
          <CollapsibleSection
            title="Domain Information"
            icon={<Globe className="h-5 w-5 text-blue-600" />}
            defaultOpen={true}
          >
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Domain Name</p>
                  {domainInfo.name ? (
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-800">
                        {domainInfo.name}
                      </p>
                      <span
                        className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                          domainInfo.isCustom
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : "bg-green-100 text-green-700 border border-green-200"
                        }`}
                      >
                        {domainInfo.isCustom
                          ? "Client's Own Domain"
                          : "Free Domain"}
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No domain selected</p>
                  )}
                </div>
              </div>

              {domainInfo.isCustom &&
                userData.questionnaireAnswers.domainProvider && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">
                      Domain Provider
                    </p>
                    <p className="text-sm text-gray-800">
                      {getStringValue(
                        userData.questionnaireAnswers.domainProvider
                      )}
                    </p>
                  </div>
                )}
            </div>
          </CollapsibleSection>

          {/* Assets */}
          <CollapsibleSection
            title="Uploaded Assets"
            icon={<Database className="h-5 w-5 text-blue-600" />}
            defaultOpen={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Logo */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-2">Logo</p>
                {userData.questionnaireAnswers.logoUpload &&
                typeof userData.questionnaireAnswers.logoUpload === "object" &&
                "url" in userData.questionnaireAnswers.logoUpload ? (
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center overflow-hidden mr-3 border border-gray-200">
                      <div className="relative w-full h-full">
                        <Image
                          src={
                            (
                              userData.questionnaireAnswers
                                .logoUpload as FileUpload
                            ).url || "/placeholder.svg"
                          }
                          alt="Logo"
                          layout="fill"
                          objectFit="contain"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        {
                          (
                            userData.questionnaireAnswers
                              .logoUpload as FileUpload
                          ).name
                        }
                      </p>
                      <p className="text-xs text-gray-500">
                        {(
                          (
                            userData.questionnaireAnswers
                              .logoUpload as FileUpload
                          ).size / 1024
                        ).toFixed(1)}{" "}
                        KB
                      </p>
                    </div>

                    <a
                      href={
                        (userData.questionnaireAnswers.logoUpload as FileUpload)
                          .url
                      }
                      download
                      className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 p-1.5 rounded-lg transition-colors duration-200 cursor-pointer"
                      title="Download"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No logo uploaded</p>
                )}
              </div>

              {/* Team Photos */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-2">Team Photos</p>
                {userData.questionnaireAnswers.teamPhotos &&
                Array.isArray(userData.questionnaireAnswers.teamPhotos) &&
                userData.questionnaireAnswers.teamPhotos.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2">
                    {(userData.questionnaireAnswers.teamPhotos as FileUpload[])
                      .slice(0, 8)
                      .map((photo: FileUpload, index: number) => (
                        <div
                          key={index}
                          className="aspect-square bg-white rounded-md flex items-center justify-center overflow-hidden border border-gray-200 relative group"
                        >
                          <div className="relative w-full h-full">
                            <Image
                              src={photo.url || "/placeholder.svg"}
                              alt={`Team photo ${index + 1}`}
                              layout="fill"
                              objectFit="cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <a
                                href={photo.url}
                                download
                                className="bg-white hover:bg-gray-50 text-gray-700 p-1.5 rounded-full transition-colors duration-200 cursor-pointer"
                                title="Download"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                  />
                                </svg>
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    {userData.questionnaireAnswers.teamPhotos.length > 8 && (
                      <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center border border-gray-200">
                        <span className="text-sm text-gray-700">
                          +{userData.questionnaireAnswers.teamPhotos.length - 8}{" "}
                          more
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No team photos uploaded
                  </p>
                )}
              </div>
            </div>
          </CollapsibleSection>

          {/* Content Preferences */}
          <CollapsibleSection
            title="Content Preferences"
            icon={<FileText className="h-5 w-5 text-blue-600" />}
            defaultOpen={true}
          >
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Content Readiness</p>
              <p className="text-sm font-medium text-gray-800">
                {renderQuestionnaireField(
                  userData.questionnaireAnswers.contentReady
                )}
              </p>
            </div>
          </CollapsibleSection>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            This client hasn't completed the questionnaire yet
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            The client needs to complete the onboarding questionnaire to provide
            information about their business and website requirements.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer">
            Send Questionnaire Reminder
          </button>
        </div>
      )}
    </div>
  );
};
