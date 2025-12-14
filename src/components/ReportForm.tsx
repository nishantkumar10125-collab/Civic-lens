import React, { useState, useRef } from 'react';
import { Camera, MapPin, Upload, AlertCircle, CheckCircle, Loader, X } from 'lucide-react';
import { ReportFormData, Issue } from '../types';
import { classifyIssue, generateReport, getDepartmentFromCategory } from '../utils/aiClassification';
import { getCurrentLocation, geocodeAddress } from '../utils/location';
import { saveIssue } from '../utils/storage';

export const ReportForm: React.FC = () => {
  const [formData, setFormData] = useState<ReportFormData>({
    description: '',
    images: [],
    location: null,
    manualAddress: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length !== files.length) {
      setError('Only image files are allowed');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles].slice(0, 5) // Max 5 images
    }));
    setError(null);
  };
  
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  const handleGetLocation = async () => {
    setIsGettingLocation(true);
    setError(null);
    
    try {
      const location = await getCurrentLocation();
      setFormData(prev => ({ ...prev, location }));
    } catch (err) {
      setError('Failed to get your location. Please enter the address manually.');
    } finally {
      setIsGettingLocation(false);
    }
  };
  
  const handleAddressGeocode = async () => {
    if (!formData.manualAddress.trim()) return;
    
    try {
      const location = await geocodeAddress(formData.manualAddress);
      setFormData(prev => ({ ...prev, location }));
    } catch (err) {
      setError('Failed to geocode the address');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      setError('Please describe the issue');
      return;
    }
    
    if (!formData.location) {
      setError('Please provide a location');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Classify the issue using AI
      const classification = classifyIssue(formData.description, formData.images);
      
      // Generate formal report
      const report = generateReport(
        formData.description,
        classification.category,
        classification.severity,
        formData.location
      );
      
      // Create issue object
      const issue: Issue = {
        id: Date.now().toString(),
        title: `${classification.category.replace('_', ' ').toUpperCase()} - ${formData.location.district}`,
        description: formData.description,
        category: classification.category,
        severity: classification.severity,
        status: 'reported',
        location: formData.location,
        images: formData.images.map(file => URL.createObjectURL(file)),
        dateReported: new Date(),
        reportedBy: 'Anonymous Citizen',
        assignedDepartment: getDepartmentFromCategory(classification.category)
      };
      
      // Save to localStorage
      saveIssue(issue);
      
      // Show success
      setShowSuccess(true);
      
      // Reset form
      setTimeout(() => {
        setFormData({
          description: '',
          images: [],
          location: null,
          manualAddress: ''
        });
        setShowSuccess(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 3000);
      
    } catch (err) {
      setError('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-900 mb-2">Report Submitted Successfully!</h3>
          <p className="text-green-700 mb-4">
            Your issue has been classified and routed to the appropriate department. 
            You'll receive updates on the progress.
          </p>
          <div className="bg-white rounded-lg p-4 text-left">
            <div className="text-sm text-gray-600 mb-2">Report Details:</div>
            <div className="text-green-700 font-medium">
              Location: {formData.location?.address}<br />
              Status: Report received and being processed
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Report a City Issue</h2>
          <p className="text-blue-100">Help make your city better by reporting infrastructure problems</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700">{error}</span>
            </div>
          )}
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe the Issue *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what you see. Be specific about the problem, its size, and any safety concerns..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              rows={4}
              required
            />
          </div>
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Photos ({formData.images.length}/5)
            </label>
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <span className="text-gray-600">Click to upload images</span>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isGettingLocation}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isGettingLocation ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
                <span>{isGettingLocation ? 'Getting Location...' : 'Use My Location'}</span>
              </button>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.manualAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, manualAddress: e.target.value }))}
                  placeholder="Or enter address manually..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddressGeocode}
                  className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Locate
                </button>
              </div>
              
              {formData.location && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-green-800">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">Location Confirmed</span>
                  </div>
                  <p className="text-green-700 mt-1">{formData.location.address}</p>
                  <p className="text-green-600 text-sm">{formData.location.district}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2 font-semibold transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Processing with AI...</span>
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                <span>Submit Report</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};