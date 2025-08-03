import {
  createMockUser,
  createMockCharity,
  createMockDonation,
} from "../testHelpers";

describe("testHelpers", () => {
  describe("createMockUser", () => {
    it("creates mock user with default values", () => {
      const user = createMockUser();

      expect(user).toEqual({
        id: "user-123",
        email: "test@example.com",
        user_metadata: { user_type: "donor" },
        app_metadata: {},
        aud: "authenticated",
        created_at: expect.any(String),
      });
    });

    it("applies overrides to mock user", () => {
      const overrides = {
        id: "custom-id",
        email: "custom@test.com",
        user_metadata: { user_type: "charity" },
      };

      const user = createMockUser(overrides);

      expect(user.id).toBe("custom-id");
      expect(user.email).toBe("custom@test.com");
      expect(user.user_metadata.user_type).toBe("charity");
    });
  });

  describe("createMockCharity", () => {
    it("creates mock charity with default values", () => {
      const charity = createMockCharity();

      expect(charity).toEqual({
        id: "charity-123",
        name: "Test Charity",
        description: "A test charity organization",
        category: "education",
        country: "US",
        verified: true,
        created_at: expect.any(String),
      });
    });

    it("applies overrides to mock charity", () => {
      const overrides = {
        name: "Custom Charity",
        category: "healthcare",
        verified: false,
      };

      const charity = createMockCharity(overrides);

      expect(charity.name).toBe("Custom Charity");
      expect(charity.category).toBe("healthcare");
      expect(charity.verified).toBe(false);
    });
  });

  describe("createMockDonation", () => {
    it("creates mock donation with default values", () => {
      const donation = createMockDonation();

      expect(donation).toEqual({
        id: "donation-123",
        amount: "100",
        donor_id: "donor-123",
        charity_id: "charity-123",
        status: "completed",
        created_at: expect.any(String),
      });
    });

    it("applies overrides to mock donation", () => {
      const overrides = {
        amount: "250",
        status: "pending",
        donor_id: "custom-donor",
      };

      const donation = createMockDonation(overrides);

      expect(donation.amount).toBe("250");
      expect(donation.status).toBe("pending");
      expect(donation.donor_id).toBe("custom-donor");
    });
  });
});
