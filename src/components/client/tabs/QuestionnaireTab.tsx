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
  Clock,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  MessageSquare,
  Target,
  Layers,
  Share2,
} from "lucide-react";
import type {
  UserData,
  WebsiteEntry,
  FileUpload,
  Service,
  SocialMediaLink,
  TeamMember,
} from "@/types";
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

  // Check if a field has data
  const hasData = (field: any): boolean => {
    if (field === undefined || field === null) return false;
    if (typeof field === "string" && field.trim() === "") return false;
    if (Array.isArray(field) && field.length === 0) return false;
    return true;
  };

  // Render field content based on its type
  const renderField = (field: any): React.ReactNode => {
    if (!hasData(field)) {
      return "Not provided";
    }

    // Handle string or number
    if (typeof field === "string" || typeof field === "number") {
      return field;
    }

    // Handle arrays of strings
    if (Array.isArray(field) && typeof field[0] === "string") {
      return field.join(", ");
    }

    // Handle arrays of objects
    if (Array.isArray(field) && typeof field[0] === "object") {
      return field
        .map((item) => {
          if (item && typeof item === "object") {
            if ("name" in item) return item.name;
            if ("platform" in item && "url" in item)
              return `${item.platform}: ${item.url}`;
          }
          return String(item);
        })
        .join(", ");
    }

    // Handle file uploads
    if (typeof field === "object" && field !== null) {
      if ("url" in field) return field.url;
      if ("name" in field) return field.name;
      return JSON.stringify(field);
    }

    return String(field);
  };

  // Helper function to parse business hours
  const renderBusinessHours = () => {
    if (!userData.questionnaireAnswers?.businessHours) return null;

    try {
      const hoursData =
        typeof userData.questionnaireAnswers.businessHours === "string"
          ? JSON.parse(userData.questionnaireAnswers.businessHours)
          : userData.questionnaireAnswers.businessHours;

      const daysOfWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {daysOfWeek.map((day) => {
            const hoursKey = `${day.toLowerCase()}Hours`;
            const hours = hoursData?.[hoursKey];

            return (
              <div
                key={day}
                className="flex items-center justify-between py-1 border-b border-gray-200"
              >
                <span className="text-sm font-medium text-gray-700">{day}</span>
                <span className="text-sm text-gray-800">
                  {hours === "closed" ? (
                    <span className="text-red-500">Closed</span>
                  ) : hours ? (
                    hours
                  ) : (
                    <span className="text-gray-400">Not specified</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      );
    } catch (e) {
      return (
        <div className="text-sm text-gray-500">
          Business hours data not available
        </div>
      );
    }
  };

  // If no questionnaire data exists
  if (!userData.questionnaireAnswers) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-600" />
          Questionnaire Answers
        </h2>
      </div>

      <div className="space-y-6">
        {/* Business Information */}
        {(hasData(userData.questionnaireAnswers.businessName) ||
          hasData(userData.questionnaireAnswers.businessTagline) ||
          hasData(userData.questionnaireAnswers.businessDescription) ||
          hasData(userData.questionnaireAnswers.businessGoals) ||
          hasData(userData.questionnaireAnswers.businessUnique) ||
          hasData(userData.questionnaireAnswers.businessStory) ||
          hasData(userData.questionnaireAnswers.businessCategory) ||
          hasData(userData.questionnaireAnswers.businessEmployeeCount) ||
          hasData(userData.questionnaireAnswers.yearsInBusiness)) && (
          <CollapsibleSection
            title="Business Information"
            icon={<Users className="h-5 w-5 text-blue-600" />}
            defaultOpen={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hasData(userData.questionnaireAnswers.businessName) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Business Name</p>
                  <p className="text-sm font-medium text-gray-800">
                    {renderField(userData.questionnaireAnswers.businessName)}
                  </p>
                </div>
              )}

              {hasData(userData.questionnaireAnswers.businessTagline) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Business Tagline</p>
                  <p className="text-sm text-gray-800">
                    {renderField(userData.questionnaireAnswers.businessTagline)}
                  </p>
                </div>
              )}

              {hasData(userData.questionnaireAnswers.businessDescription) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">
                    Business Description
                  </p>
                  <p className="text-sm text-gray-800">
                    {renderField(
                      userData.questionnaireAnswers.businessDescription
                    )}
                  </p>
                </div>
              )}

              {hasData(userData.questionnaireAnswers.yearsInBusiness) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">
                    Years in Business
                  </p>
                  <p className="text-sm text-gray-800">
                    {renderField(userData.questionnaireAnswers.yearsInBusiness)}
                  </p>
                </div>
              )}

              {hasData(userData.questionnaireAnswers.businessCategory) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">
                    Business Industry
                  </p>
                  <p className="text-sm text-gray-800">
                    {renderField(
                      userData.questionnaireAnswers.businessCategory
                    )}
                  </p>
                </div>
              )}

              {hasData(userData.questionnaireAnswers.businessStory) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Business Story</p>
                  <p className="text-sm text-gray-800">
                    {renderField(userData.questionnaireAnswers.businessStory)}
                  </p>
                </div>
              )}

              {hasData(userData.questionnaireAnswers.businessGoals) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Business Goals</p>
                  <p className="text-sm text-gray-800">
                    {renderField(userData.questionnaireAnswers.businessGoals)}
                  </p>
                </div>
              )}

              {hasData(userData.questionnaireAnswers.businessUnique) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">
                    Business Unique Selling Points
                  </p>
                  <p className="text-sm text-gray-800">
                    {renderField(userData.questionnaireAnswers.businessUnique)}
                  </p>
                </div>
              )}

              {hasData(userData.questionnaireAnswers.businessEmployeeCount) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Employee Count</p>
                  <p className="text-sm text-gray-800">
                    {renderField(
                      userData.questionnaireAnswers.businessEmployeeCount
                    )}
                  </p>
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}

        {/* Website Type */}
        {(hasData(userData.questionnaireAnswers.websiteType) ||
          hasData(userData.questionnaireAnswers.primaryWebsiteGoal) ||
          hasData(userData.questionnaireAnswers.ctaOptions) ||
          hasData(userData.questionnaireAnswers.desiredVisitorActions) ||
          hasData(userData.questionnaireAnswers.primaryCTA)) && (
          <CollapsibleSection
            title="Website Type & Goals"
            icon={<Globe className="h-5 w-5 text-blue-600" />}
            defaultOpen={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hasData(userData.questionnaireAnswers.websiteType) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Website Type</p>
                  <p className="text-sm font-medium text-gray-800">
                    {renderField(userData.questionnaireAnswers.websiteType)}
                  </p>
                </div>
              )}

              {hasData(userData.questionnaireAnswers.primaryWebsiteGoal) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">
                    Primary Website Goal
                  </p>
                  <p className="text-sm text-gray-800">
                    {renderField(
                      userData.questionnaireAnswers.primaryWebsiteGoal
                    )}
                  </p>
                </div>
              )}

              {hasData(userData.questionnaireAnswers.primaryCTA) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">
                    Primary Call to Action
                  </p>
                  <p className="text-sm text-gray-800">
                    {renderField(userData.questionnaireAnswers.primaryCTA)}
                  </p>
                </div>
              )}

              {hasData(userData.questionnaireAnswers.ctaOptions) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">
                    Call to Action Options
                  </p>
                  <p className="text-sm text-gray-800">
                    {renderField(userData.questionnaireAnswers.ctaOptions)}
                  </p>
                </div>
              )}

              {hasData(userData.questionnaireAnswers.desiredVisitorActions) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">
                    Desired Visitor Actions
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {Array.isArray(
                      userData.questionnaireAnswers.desiredVisitorActions
                    )
                      ? userData.questionnaireAnswers.desiredVisitorActions.map(
                          (action, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border border-gray-200"
                            >
                              {action}
                            </span>
                          )
                        )
                      : renderField(
                          userData.questionnaireAnswers.desiredVisitorActions
                        )}
                  </div>
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}

        {/* Website Structure */}
        {(hasData(userData.questionnaireAnswers.websitePages) ||
          hasData(userData.questionnaireAnswers.ecommerceNeeded) ||
          hasData(userData.questionnaireAnswers.blogNeeded)) && (
          <CollapsibleSection
            title="Website Structure"
            icon={<Layers className="h-5 w-5 text-blue-600" />}
            defaultOpen={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hasData(userData.questionnaireAnswers.websitePages) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Website Pages</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {Array.isArray(userData.questionnaireAnswers.websitePages)
                      ? userData.questionnaireAnswers.websitePages.map(
                          (page, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border border-gray-200"
                            >
                              {page}
                            </span>
                          )
                        )
                      : renderField(userData.questionnaireAnswers.websitePages)}
                  </div>
                </div>
              )}

              {hasData(userData.questionnaireAnswers.ecommerceNeeded) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">
                    E-commerce Needed
                  </p>
                  <p className="text-sm text-gray-800">
                    {renderField(userData.questionnaireAnswers.ecommerceNeeded)}
                  </p>
                </div>
              )}

              {hasData(userData.questionnaireAnswers.blogNeeded) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Blog Needed</p>
                  <p className="text-sm text-gray-800">
                    {renderField(userData.questionnaireAnswers.blogNeeded)}
                  </p>
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}

        {/* Services & Products */}
        {hasData(userData.questionnaireAnswers.services) && (
          <CollapsibleSection
            title="Services & Products"
            icon={<Layers className="h-5 w-5 text-blue-600" />}
            defaultOpen={true}
          >
            <div className="space-y-4">
              {Array.isArray(userData.questionnaireAnswers.services) &&
                userData.questionnaireAnswers.services.map(
                  (service: Service, index: number) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start">
                        {service.image && service.image.url ? (
                          <div className="w-16 h-16 bg-white rounded-md overflow-hidden mr-4 border border-gray-200 flex-shrink-0">
                            <Image
                              src={service.image.url}
                              alt={service.name || `Service ${index + 1}`}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center mr-4 flex-shrink-0">
                            <Layers className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-medium text-gray-800">
                            {service.name}
                          </h4>
                          {service.price && (
                            <p className="text-xs text-blue-600">
                              {service.price}
                            </p>
                          )}
                          <p className="text-xs text-gray-600 mt-1">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              {hasData(userData.questionnaireAnswers.servicesProducts) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">
                    Services Description
                  </p>
                  <p className="text-sm text-gray-800">
                    {renderField(
                      userData.questionnaireAnswers.servicesProducts
                    )}
                  </p>
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}

        {/* Team Members */}
        {hasData(userData.questionnaireAnswers.teamMembers) && (
          <CollapsibleSection
            title="Team Members"
            icon={<Users className="h-5 w-5 text-blue-600" />}
            defaultOpen={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.isArray(userData.questionnaireAnswers.teamMembers) &&
                userData.questionnaireAnswers.teamMembers.map(
                  (member: TeamMember, index: number) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start">
                        {member.image && member.image.url ? (
                          <div className="w-16 h-16 bg-white rounded-full overflow-hidden mr-4 border border-gray-200 flex-shrink-0">
                            <Image
                              src={member.image.url}
                              alt={member.name || `Team member ${index + 1}`}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                            <Users className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-medium text-gray-800">
                            {member.name}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {member.position}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {member.description}
                          </p>

                          {member.socialMedia &&
                            member.socialMedia.length > 0 && (
                              <div className="flex gap-2 mt-2">
                                {member.socialMedia.map(
                                  (social, socialIndex) => (
                                    <a
                                      key={socialIndex}
                                      href={
                                        social.url.startsWith("http")
                                          ? social.url
                                          : `https://${social.url}`
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800"
                                      title={social.platform}
                                    >
                                      <Globe className="h-3 w-3" />
                                    </a>
                                  )
                                )}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  )
                )}
            </div>
          </CollapsibleSection>
        )}

        {/* Competitors */}
        {hasData(userData.questionnaireAnswers.competitors) && (
          <CollapsibleSection
            title="Competitors"
            icon={<Briefcase className="h-5 w-5 text-blue-600" />}
            defaultOpen={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.isArray(userData.questionnaireAnswers.competitors) &&
                userData.questionnaireAnswers.competitors.map(
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
          </CollapsibleSection>
        )}

        {/* Design Information */}
        {(hasData(userData.questionnaireAnswers.websiteStyle) ||
          hasData(userData.questionnaireAnswers.colorPreferences) ||
          hasData(userData.questionnaireAnswers.favoriteWebsites) ||
          hasData(userData.questionnaireAnswers.contentTone) ||
          hasData(userData.questionnaireAnswers.heroImageOption)) && (
          <CollapsibleSection
            title="Design & Style Preferences"
            icon={<Palette className="h-5 w-5 text-blue-600" />}
            defaultOpen={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hasData(userData.questionnaireAnswers.websiteStyle) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Website Style</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Array.isArray(userData.questionnaireAnswers.websiteStyle)
                      ? userData.questionnaireAnswers.websiteStyle.map(
                          (style: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200"
                            >
                              {style}
                            </span>
                          )
                        )
                      : renderField(userData.questionnaireAnswers.websiteStyle)}
                  </div>
                </div>
              )}

              {hasData(userData.questionnaireAnswers.colorPreferences) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">
                    Color Preferences
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Array.isArray(
                      userData.questionnaireAnswers.colorPreferences
                    )
                      ? userData.questionnaireAnswers.colorPreferences.map(
                          (color: string, index: number) => (
                            <div key={index} className="flex items-center">
                              <div
                                className="w-4 h-4 rounded-full mr-1 border border-gray-200"
                                style={{ backgroundColor: color }}
                              ></div>
                              <span className="text-xs text-gray-700">
                                {color}
                              </span>
                            </div>
                          )
                        )
                      : renderField(
                          userData.questionnaireAnswers.colorPreferences
                        )}
                  </div>
                </div>
              )}

              {hasData(userData.questionnaireAnswers.contentTone) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Content Tone</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {Array.isArray(
                      userData.questionnaireAnswers.contentTone
                    ) ? (
                      userData.questionnaireAnswers.contentTone.map(
                        (tone, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border border-gray-200"
                          >
                            {tone}
                          </span>
                        )
                      )
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border border-gray-200">
                        {renderField(userData.questionnaireAnswers.contentTone)}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {hasData(userData.questionnaireAnswers.heroImageOption) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">
                    Hero Image Preference
                  </p>
                  <p className="text-sm text-gray-800">
                    {renderField(userData.questionnaireAnswers.heroImageOption)}
                  </p>
                  {userData.questionnaireAnswers.heroImageUpload && (
                    <div className="mt-2 flex items-center">
                      <div className="w-16 h-10 bg-white rounded-md overflow-hidden mr-2 border border-gray-200">
                        <Image
                          src={
                            (
                              userData.questionnaireAnswers
                                .heroImageUpload as FileUpload
                            ).url
                          }
                          alt="Hero Image"
                          width={64}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs text-gray-600">
                        Uploaded hero image
                      </span>
                    </div>
                  )}
                </div>
              )}

              {hasData(userData.questionnaireAnswers.favoriteWebsites) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">
                    Favorite Websites
                  </p>
                  <div className="space-y-2 mt-2">
                    {Array.isArray(
                      userData.questionnaireAnswers.favoriteWebsites
                    ) &&
                      userData.questionnaireAnswers.favoriteWebsites.map(
                        (site: WebsiteEntry, index: number) => (
                          <div key={index} className="flex items-center">
                            <Globe className="h-3 w-3 text-gray-500 mr-2" />
                            <span className="text-xs text-gray-700 mr-1">
                              {site.name}:
                            </span>
                            <a
                              href={
                                site.url.startsWith("http")
                                  ? site.url
                                  : `https://${site.url}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              {site.url}
                            </a>
                          </div>
                        )
                      )}
                  </div>
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}
        {/* Social Media */}
        {hasData(userData.questionnaireAnswers.socialMediaLinks) && (
          <CollapsibleSection
            title="Social Media"
            icon={<Share2 className="h-5 w-5 text-blue-600" />}
            defaultOpen={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Array.isArray(userData.questionnaireAnswers.socialMediaLinks) &&
                userData.questionnaireAnswers.socialMediaLinks.map(
                  (social: SocialMediaLink, index: number) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center"
                    >
                      <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                        <Globe className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {social.platform}
                        </p>
                        {social.url && (
                          <a
                            href={
                              social.url.startsWith("http")
                                ? social.url
                                : `https://${social.url}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center"
                          >
                            {social.url}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        )}
                      </div>
                    </div>
                  )
                )}
            </div>
          </CollapsibleSection>
        )}

        {/* Contact Information */}
        {(hasData(userData.questionnaireAnswers.phoneNumber) ||
          hasData(userData.questionnaireAnswers.emailAddress) ||
          hasData(userData.questionnaireAnswers.businessAddress)) && (
          <CollapsibleSection
            title="Contact Information"
            icon={<Phone className="h-5 w-5 text-blue-600" />}
            defaultOpen={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hasData(userData.questionnaireAnswers.phoneNumber) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-500 mr-2" />
                    <p className="text-sm text-gray-800">
                      {renderField(userData.questionnaireAnswers.phoneNumber)}
                    </p>
                  </div>
                </div>
              )}

              {hasData(userData.questionnaireAnswers.emailAddress) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Email Address</p>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-500 mr-2" />
                    <p className="text-sm text-gray-800">
                      {renderField(userData.questionnaireAnswers.emailAddress)}
                    </p>
                  </div>
                </div>
              )}

              {hasData(userData.questionnaireAnswers.businessAddress) && (
                <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Business Address</p>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                    <p className="text-sm text-gray-800">
                      {getStringValue(
                        userData.questionnaireAnswers.businessAddress
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}

        {/* Business Hours */}
        {hasData(userData.questionnaireAnswers.businessHours) && (
          <CollapsibleSection
            title="Business Hours"
            icon={<Clock className="h-5 w-5 text-blue-600" />}
            defaultOpen={true}
          >
            <div className="bg-gray-50 p-4 rounded-lg">
              {renderBusinessHours()}
            </div>
          </CollapsibleSection>
        )}

        {/* Current Website Information */}
        {hasData(userData.questionnaireAnswers.hasCurrentWebsite) && (
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
                  {renderField(userData.questionnaireAnswers.hasCurrentWebsite)}
                </p>
              </div>

              {userData.questionnaireAnswers.hasCurrentWebsite === "Yes" && (
                <>
                  {hasData(userData.questionnaireAnswers.currentWebsiteUrl) && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">
                        Current Website URL
                      </p>
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
                    </div>
                  )}

                  {hasData(userData.questionnaireAnswers.currentCms) && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Current CMS</p>
                      <p className="text-sm text-gray-800">
                        {renderField(userData.questionnaireAnswers.currentCms)}
                      </p>
                    </div>
                  )}

                  {hasData(userData.questionnaireAnswers.websiteLikes) && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">
                        Current Website Likes
                      </p>
                      <p className="text-sm text-gray-800">
                        {renderField(
                          userData.questionnaireAnswers.websiteLikes
                        )}
                      </p>
                    </div>
                  )}

                  {hasData(userData.questionnaireAnswers.websiteDislikes) && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">
                        Current Website Dislikes
                      </p>
                      <p className="text-sm text-gray-800">
                        {renderField(
                          userData.questionnaireAnswers.websiteDislikes
                        )}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </CollapsibleSection>
        )}

        {/* E-commerce & Booking Information */}
        {(hasData(userData.questionnaireAnswers.usingEcommerce) ||
          hasData(userData.questionnaireAnswers.usingBookingPlatform)) && (
          <CollapsibleSection
            title="E-Commerce & Booking"
            icon={<Briefcase className="h-5 w-5 text-blue-600" />}
            defaultOpen={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hasData(userData.questionnaireAnswers.usingEcommerce) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Using E-commerce</p>
                  <p className="text-sm font-medium text-gray-800">
                    {renderField(userData.questionnaireAnswers.usingEcommerce)}
                  </p>

                  {hasData(userData.questionnaireAnswers.ecommerceUrl) && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">
                        E-commerce URL
                      </p>
                      <a
                        href={
                          getStringValue(
                            userData.questionnaireAnswers.ecommerceUrl
                          ).startsWith("http")
                            ? getStringValue(
                                userData.questionnaireAnswers.ecommerceUrl
                              )
                            : `https://${getStringValue(
                                userData.questionnaireAnswers.ecommerceUrl
                              )}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center text-sm"
                      >
                        {getStringValue(
                          userData.questionnaireAnswers.ecommerceUrl
                        )}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {hasData(userData.questionnaireAnswers.usingBookingPlatform) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">
                    Using Booking Platform
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {renderField(
                      userData.questionnaireAnswers.usingBookingPlatform
                    )}
                  </p>

                  {hasData(
                    userData.questionnaireAnswers.bookingPlatformUrl
                  ) && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">
                        Booking Platform URL
                      </p>
                      <a
                        href={
                          getStringValue(
                            userData.questionnaireAnswers.bookingPlatformUrl
                          ).startsWith("http")
                            ? getStringValue(
                                userData.questionnaireAnswers.bookingPlatformUrl
                              )
                            : `https://${getStringValue(
                                userData.questionnaireAnswers.bookingPlatformUrl
                              )}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center text-sm"
                      >
                        {getStringValue(
                          userData.questionnaireAnswers.bookingPlatformUrl
                        )}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}

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
              hasData(userData.questionnaireAnswers.domainProvider) && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Domain Provider</p>
                  <p className="text-sm text-gray-800">
                    {getStringValue(
                      userData.questionnaireAnswers.domainProvider
                    )}
                  </p>
                </div>
              )}

            {hasData(userData.questionnaireAnswers.professionalEmails) && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-1">
                  Professional Emails
                </p>
                <div className="space-y-1 mt-2">
                  {(() => {
                    try {
                      const emails = JSON.parse(
                        getStringValue(
                          userData.questionnaireAnswers.professionalEmails
                        )
                      );
                      if (Array.isArray(emails) && emails.length > 0) {
                        const domain =
                          domainInfo.name ||
                          getStringValue(
                            userData.questionnaireAnswers.customDomainName
                          ) ||
                          getStringValue(
                            userData.questionnaireAnswers.domainName
                          ) ||
                          "example.com";

                        return emails.map((email, index) => (
                          <div key={index} className="flex items-center">
                            <Mail className="h-3 w-3 text-gray-400 mr-2" />
                            <p className="text-xs text-gray-800">
                              {email}@{domain}
                            </p>
                          </div>
                        ));
                      }
                      return (
                        <p className="text-xs text-gray-500">
                          No email addresses configured
                        </p>
                      );
                    } catch (e) {
                      return (
                        <p className="text-xs text-gray-500">
                          Email configuration not valid
                        </p>
                      );
                    }
                  })()}
                </div>
              </div>
            )}
          </div>
        </CollapsibleSection>

        {/* Uploaded Assets */}
        {(hasData(userData.questionnaireAnswers.logoUpload) ||
          hasData(userData.questionnaireAnswers.faviconUpload) ||
          hasData(userData.questionnaireAnswers.teamPhotos) ||
          hasData(userData.questionnaireAnswers.heroImageUpload)) && (
          <CollapsibleSection
            title="Uploaded Assets"
            icon={<Database className="h-5 w-5 text-blue-600" />}
            defaultOpen={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Logo */}
              {hasData(userData.questionnaireAnswers.logoUpload) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Logo</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center overflow-hidden mr-3 border border-gray-200">
                      <Image
                        src={
                          (
                            userData.questionnaireAnswers
                              .logoUpload as FileUpload
                          ).url || "/placeholder.svg"
                        }
                        alt="Logo"
                        width={48}
                        height={48}
                        className="object-contain"
                      />
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
                </div>
              )}

              {/* Favicon */}
              {(hasData(userData.questionnaireAnswers.faviconUpload) ||
                hasData(userData.questionnaireAnswers.logoUpload)) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Favicon</p>
                  {userData.questionnaireAnswers.faviconUpload &&
                  typeof userData.questionnaireAnswers.faviconUpload ===
                    "object" &&
                  "url" in userData.questionnaireAnswers.faviconUpload ? (
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center overflow-hidden mr-3 border border-gray-200">
                        <Image
                          src={
                            (
                              userData.questionnaireAnswers
                                .faviconUpload as FileUpload
                            ).url || "/placeholder.svg"
                          }
                          alt="Favicon"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">
                          {
                            (
                              userData.questionnaireAnswers
                                .faviconUpload as FileUpload
                            ).name
                          }
                        </p>
                        <p className="text-xs text-gray-500">
                          {(
                            (
                              userData.questionnaireAnswers
                                .faviconUpload as FileUpload
                            ).size / 1024
                          ).toFixed(1)}{" "}
                          KB
                        </p>
                      </div>

                      <a
                        href={
                          (
                            userData.questionnaireAnswers
                              .faviconUpload as FileUpload
                          ).url
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
                  ) : userData.questionnaireAnswers.logoUpload ? (
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center overflow-hidden mr-3 border border-gray-200">
                        <Image
                          src={
                            (
                              userData.questionnaireAnswers
                                .logoUpload as FileUpload
                            ).url || "/placeholder.svg"
                          }
                          alt="Logo used as Favicon"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">
                          Using logo as favicon
                        </p>
                        <p className="text-xs text-gray-500">
                          {
                            (
                              userData.questionnaireAnswers
                                .logoUpload as FileUpload
                            ).name
                          }
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No favicon uploaded</p>
                  )}
                </div>
              )}
              {/* Team Photos */}
              {hasData(userData.questionnaireAnswers.teamPhotos) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Team Photos</p>
                  <div className="grid grid-cols-4 gap-2">
                    {(userData.questionnaireAnswers.teamPhotos as FileUpload[])
                      .slice(0, 8)
                      .map((photo: FileUpload, index: number) => (
                        <div
                          key={index}
                          className="aspect-square bg-white rounded-md flex items-center justify-center overflow-hidden border border-gray-200 relative group"
                        >
                          <Image
                            src={photo.url || "/placeholder.svg"}
                            alt={`Team photo ${index + 1}`}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
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
                      ))}
                    {Array.isArray(userData.questionnaireAnswers.teamPhotos) &&
                      userData.questionnaireAnswers.teamPhotos.length > 8 && (
                        <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center border border-gray-200">
                          <span className="text-sm text-gray-700">
                            +
                            {userData.questionnaireAnswers.teamPhotos.length -
                              8}{" "}
                            more
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* Hero Image */}
              {hasData(userData.questionnaireAnswers.heroImageUpload) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Hero Image</p>
                  <div className="flex items-center">
                    <div className="w-24 h-16 bg-white rounded-md flex items-center justify-center overflow-hidden mr-3 border border-gray-200">
                      <Image
                        src={
                          (
                            userData.questionnaireAnswers
                              .heroImageUpload as FileUpload
                          ).url || "/placeholder.svg"
                        }
                        alt="Hero Image"
                        width={96}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        {
                          (
                            userData.questionnaireAnswers
                              .heroImageUpload as FileUpload
                          ).name
                        }
                      </p>
                      <p className="text-xs text-gray-500">
                        {(
                          (
                            userData.questionnaireAnswers
                              .heroImageUpload as FileUpload
                          ).size / 1024
                        ).toFixed(1)}{" "}
                        KB
                      </p>
                    </div>
                    <a
                      href={
                        (
                          userData.questionnaireAnswers
                            .heroImageUpload as FileUpload
                        ).url
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
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}

        {/* Content Preferences */}
        {(hasData(userData.questionnaireAnswers.contentReady) ||
          hasData(userData.questionnaireAnswers.additionalContent) ||
          hasData(userData.questionnaireAnswers.additionalInfo)) && (
          <CollapsibleSection
            title="Content Preferences"
            icon={<FileText className="h-5 w-5 text-blue-600" />}
            defaultOpen={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hasData(userData.questionnaireAnswers.contentReady) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">
                    Content Readiness
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {renderField(userData.questionnaireAnswers.contentReady)}
                  </p>
                </div>
              )}

              {hasData(userData.questionnaireAnswers.additionalContent) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">
                    Additional Content Information
                  </p>
                  <p className="text-sm text-gray-800">
                    {renderField(
                      userData.questionnaireAnswers.additionalContent
                    )}
                  </p>
                </div>
              )}

              {hasData(userData.questionnaireAnswers.additionalInfo) && (
                <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                  <p className="text-xs text-gray-500 mb-1">
                    Additional Information
                  </p>
                  <p className="text-sm text-gray-800">
                    {renderField(userData.questionnaireAnswers.additionalInfo)}
                  </p>
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}
      </div>
    </div>
  );
};
