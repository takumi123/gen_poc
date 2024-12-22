'use client';

import React, { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 実際のAPIエンドポイントに送信する処理を実装
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">お問い合わせありがとうございます</h2>
          <p className="text-gray-600 mb-4">
            内容を確認次第、担当者よりご連絡させていただきます。
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-blue-600 hover:text-blue-800"
          >
            新しいお問い合わせを作成
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">お問い合わせ</h1>
      
      <div className="max-w-2xl mx-auto">
        <p className="text-gray-600 mb-8">
          サービスに関するご質問、ご要望などございましたら、以下のフォームよりお気軽にお問い合わせください。
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              お名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              お問い合わせ種別 <span className="text-red-500">*</span>
            </label>
            <select
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">選択してください</option>
              <option value="general">一般的なお問い合わせ</option>
              <option value="bug">不具合の報告</option>
              <option value="feature">機能の要望</option>
              <option value="business">ビジネスに関するお問い合わせ</option>
              <option value="other">その他</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              お問い合わせ内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              送信する
            </button>
          </div>
        </form>

        <div className="mt-12 border-t pt-8">
          <h2 className="text-xl font-semibold mb-4">その他のお問い合わせ方法</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">メールでのお問い合わせ</h3>
              <p className="text-gray-600">support@example.com</p>
            </div>
            <div>
              <h3 className="font-medium">お電話でのお問い合わせ</h3>
              <p className="text-gray-600">03-XXXX-XXXX（平日10:00〜18:00）</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
